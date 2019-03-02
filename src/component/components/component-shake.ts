import { ComponentHandler } from '../component-sytem.types';

export const componentShake: ComponentHandler<ComponentDataShake> = {
  inits: {
    duration: 2,
    offset: { x: 50, y: 50},
    step: 0.1,
  },
  initialize({entity}): void {
    entity.position = entity.position ? entity.position : { x: 0, y: 0};
  },
  isOver({componentData }): boolean {
    return componentData.duration !== undefined && componentData.duration < 0;
  },
  type: 'componentKeepInRectangle',
  update: (
    {entity, elapsedTime = 0, componentData }) => {
      // Init
      componentData.currentTime = componentData.currentTime === undefined
        ? componentData.step
        : componentData.currentTime - elapsedTime;

      // Update shake
      if (componentData.currentTime < 0) {
        componentData.currentTime = componentData.step;

        // remove the current shake
        if (componentData.currentShake) {
          entity.position = {
            x: entity.position.x - componentData.currentShake.x,
            y: entity.position.y - componentData.currentShake.y,
          };
        }

        componentData.currentShake = { x: Math.random() * componentData.offset.x, y: Math.random() * componentData.offset.y };

        // Set the new shake
        entity.position = {
          x: entity.position.x + componentData.currentShake.x,
          y: entity.position.y + componentData.currentShake.y,
        };
      }

      // Update duration
      if (componentData.duration !== undefined) {
        componentData.duration -= elapsedTime;
      }
  },
};

export interface ComponentDataShake {
  offset: {x: number, y: number};
  step: number;
  currentShake?: {x: number, y: number};
  currentTime?: number;
  duration?: number;
}
