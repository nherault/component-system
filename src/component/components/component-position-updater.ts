import { ComponentHandler } from '../component-sytem.types';

export const componentPositionUpdater: ComponentHandler = {
    type: 'componentPositionUpdater',
    initialize({entity}): void {
        entity.velocity = entity.velocity ? entity.velocity : { x: 0, y: 0};
    },
    update: (
      {entity, elapsedTime}) => {
        const currElapsedTime = elapsedTime !== undefined ? elapsedTime : 0;
        entity.position.x += entity.velocity.x * currElapsedTime;
        entity.position.y += entity.velocity.y * currElapsedTime;
    },
  };
