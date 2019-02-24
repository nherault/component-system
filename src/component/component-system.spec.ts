import { ComponentSystemDefault } from './component-system';
import { ActionsDispatcher, ComponentData, ComponentEvent, ComponentHandler } from './component-sytem.types';

const componentPositionUpdate: ComponentHandler = {
  inits: {
    positionDeltaX: 5,
    positionDeltaY: 5,
  },
  type: 'componentPositionUpdate',
  initialize({entity, inits}: {entity: any, inits?: any}): void {
      entity.position = inits && inits.position ? inits.position : entity.position;
  },
  update: (
    {entity, componentData, elapsedTime, actionsDispatcher}:
    { entity?: any, elapsedTime?: number,
      componentData?: {[propName: string]: any}, actionsDispatcher?: ActionsDispatcher,
    }) => {
        if (componentData && elapsedTime && actionsDispatcher) {
          entity.position = {
            x: entity.position.x * componentData.positionDeltaX * elapsedTime,
            y: entity.position.y * componentData.positionDeltaY * elapsedTime,
          };
          actionsDispatcher(componentData.selector, entity.value);
        }
  },
};

const componentNameUpdate: ComponentHandler = {
  type: 'componentNameUpdate',
  update: ({entity}) => {
      entity.name = `${entity.name} UPDATED`;
      return entity.name;
  },
};

describe('component-system', () => {

  describe('registerComponentHandler', () => {
    let componentSystem: ComponentSystemDefault;
    let entity: any;

    beforeEach(() => {
      componentSystem = new ComponentSystemDefault();
      componentSystem.registerComponentHandler(componentPositionUpdate);
      componentSystem.registerComponentHandler(componentNameUpdate);

      entity = { name: 'myEntity', position: { x: 10, y: 20 }, value: 'myValue' };
    });

    it('registerComponentHandler - deregisterComponentHandler', () => {
      expect(componentSystem.getComponents()).toEqual([componentPositionUpdate, componentNameUpdate]);

      componentSystem.deregisterComponentHandler(componentPositionUpdate);
      expect(componentSystem.getComponents()).toEqual([componentNameUpdate]);

      componentSystem.deregisterComponentHandler();
      expect(componentSystem.getComponents()).toEqual([]);
    });

    it('addComponentToEntity', () => {
      expect(entity.position).toEqual({ x: 10, y: 20 });

      componentSystem.addComponentToEntity(entity, componentPositionUpdate.type, { position: { x: 50, y: 100 } });
      expect(entity.name).toBe('myEntity');
      expect(entity.position).toEqual({ x: 50, y: 100 });
    });

    it('removeComponentFromEntity', () => {
      componentSystem.addComponentToEntity(entity, componentPositionUpdate.type, { position: { x: 50, y: 100 } });
      componentSystem.addComponentToEntity(entity, componentNameUpdate.type);

      let componentData: ComponentData[] = componentSystem.getComponentsFromEntity(entity);
      expect(componentData).toEqual([{
        data: {
          position: {
            x: 50,
            y: 100,
          },
          positionDeltaX: 5,
          positionDeltaY: 5,
        },
        type: 'componentPositionUpdate',
      }, {
        data: {},
        type: 'componentNameUpdate',
      }]);

      componentSystem.removeComponentFromEntity(entity, componentPositionUpdate.type);
      componentData = componentSystem.getComponentsFromEntity(entity);
      expect(componentData).toEqual([{
        data: {},
        type: 'componentNameUpdate',
      }]);

      componentSystem.removeComponentFromEntity(entity);
      expect(componentSystem.getComponentsFromEntity(entity)).toEqual([]);
    });

    it('updateEntityComponents', () => {
      const spys = {
        ACTION_DISPATCHER: (actionType: string, payload?: any) => ({ actionType, payload }),
      };
      spyOn(spys, 'ACTION_DISPATCHER');
      expect(entity.position).toEqual({ x: 10, y: 20 });

      componentSystem.addComponentToEntity(
        entity,
        componentPositionUpdate.type,
        { selector: 'mySelector', positionDeltaY: 10, position: { x: 50, y: 100 } });
      componentSystem.updateEntityComponents(entity, 5, spys.ACTION_DISPATCHER);
      expect(entity.position).toEqual({ x: 1250, y: 5000 });
      expect(spys.ACTION_DISPATCHER).toHaveBeenCalledWith('mySelector', 'myValue');
    });

    it('addIsUpdate - removeIsUpdate', () => {
      componentSystem.addComponentToEntity(entity, componentNameUpdate.type);

      componentSystem.updateEntityComponents(entity);
      expect(entity.name).toEqual('myEntity UPDATED');

      componentSystem.addIsUpdate('componentNameUpdate', () => false);
      componentSystem.updateEntityComponents(entity);
      expect(entity.name).toEqual('myEntity UPDATED');

      componentSystem.removeIsUpdate('componentNameUpdate');
      componentSystem.updateEntityComponents(entity);
      expect(entity.name).toEqual('myEntity UPDATED UPDATED');
    });

    it('handleEvents', done => {
      componentSystem.addComponentToEntity(entity, componentNameUpdate.type);

      componentSystem.updateEntityComponents(entity);
      componentSystem.handleEvents((componentEvent: ComponentEvent) => {
        expect(componentEvent.type).toBe('componentNameUpdate');
        expect(componentEvent.payload).toBe('myEntity UPDATED');
        done();
      });
    });
  });
});
