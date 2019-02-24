import { ComponentHandler } from '../component-sytem.types';

export const componentTimerEvent: ComponentHandler<ComponentDataTimerEvent> = {
  inits: {
    timer: undefined,
  },
  type: 'componentTimerEvent',
  update: (
    {entity, elapsedTime = 0, componentData }) => {
      if (componentData.timer !== undefined) {
        componentData.timer -= elapsedTime;
      }

      if (componentData.timer === undefined || componentData.timer < 0) {
        return { entity, eventType: componentData.eventType };
      }
      return;
  },
};

export interface ComponentDataTimerEvent {
  eventType?: string;
  timer: number | undefined;
}
