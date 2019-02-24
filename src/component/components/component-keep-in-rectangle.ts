import { ComponentHandler } from '../component-sytem.types';

export const componentKeepInRectangle: ComponentHandler<ComponentDataKeepInRectangle> = {
  inits: {
    position: { x: 0, y: 0},
    size: { x: 1, y: 1},
  },
  initialize({entity}): void {
    entity.position = entity.position ? entity.position : { x: 0, y: 0};
    entity.size = entity.size ? entity.size : { x: 1, y: 1};
},
  type: 'componentKeepInRectangle',
  update: (
    {entity, componentData }) => {
      keepInsideRectangle(entity, componentData);
  },
};

export interface ComponentDataKeepInRectangle {
  position: {x: number, y: number};
  size: {x: number, y: number};
}

function keepInsideRectangle(entity2D: ComponentDataKeepInRectangle, area: ComponentDataKeepInRectangle): void {
  if (entity2D.position.x < area.position.x) {
    entity2D.position.x = area.position.x;
  }

  if (entity2D.position.y < area.position.y) {
    entity2D.position.y = area.position.y;
  }

  if (entity2D.position.x + entity2D.size.x > area.position.x + area.size.x) {
    entity2D.position.x = area.position.x + area.size.x - entity2D.size.x;
  }

  if (entity2D.position.y + entity2D.size.y > area.position.y + area.size.y) {
    entity2D.position.y = area.position.y + area.size.y - entity2D.size.y;
  }
}
