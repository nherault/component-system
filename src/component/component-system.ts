import {
    ActionsDispatcher,
    ComponentData,
    ComponentEvent,
    ComponentHandler,
    ComponentSystem,
    UpdateFn,
} from './component-sytem.types';

const copy = (value: any) => JSON.parse(JSON.stringify(value));

interface ComponentDescription<T = any> {
    componentHandler: ComponentHandler<T>;
    isUpdates?: UpdateFn<T>;
}

export class ComponentSystemDefault implements ComponentSystem {

    private componentsPropertyName: string;
    private components: { [key: string]: ComponentDescription };
    private events: ComponentEvent[];

    constructor(newName?: string) {
        this.componentsPropertyName = newName && newName.trim().length > 1 ? newName : 'components';
        this.components = {};
        this.events = [];
    }

    public registerComponentHandler<T>(componentHandler: ComponentHandler<T>): ComponentSystem {
        this.components[componentHandler.type] = {
            componentHandler,
        };
        return this;
    }

    public deregisterComponentHandler<T>(componentHandler?: ComponentHandler<T>): ComponentSystem {
        if (componentHandler) {
            delete this.components[componentHandler.type];
        } else {
            this.components = {};
        }
        return this;
    }

    public getComponents<T>(): Array<ComponentHandler<T>> {
        return Object.values(this.components)
            .map(componentDescription => componentDescription.componentHandler);
    }

    public addIsUpdate<T>(componentType: string, isUpdate: UpdateFn<T>): ComponentSystem {
        this.components[componentType].isUpdates = isUpdate;
        return this;
    }

    public removeIsUpdate(componentType: string): ComponentSystem {
        delete this.components[componentType].isUpdates;
        return this;
    }

    public addComponentToEntity(entity: any, componentType: string, inits?: any): ComponentSystem {
        const componentDescription = this.components[componentType];
        if (componentDescription) {
            entity[this.componentsPropertyName] = entity[this.componentsPropertyName] || [];
            const componentHandler = componentDescription.componentHandler;
            if (componentHandler.initialize) {
                componentHandler.initialize({entity, inits});
            }
            entity[this.componentsPropertyName].push(copy({
                    data: {
                        ...componentHandler.inits,
                        ...inits,
                    },
                    type: componentHandler.type,
                }));
        }
        return this;
    }

    public getComponentsFromEntity<T>(entity: any, componentType?: string): Array<ComponentData<T>> {
        if (componentType !== undefined) {
            const components: Array<ComponentData<T>> = entity[this.componentsPropertyName] || [];
            return components.filter(component => component.type === componentType);
        }
        return entity[this.componentsPropertyName] || [];
    }

    public removeComponentFromEntity(entity: any, componentType?: string): ComponentSystem {
        if (componentType) {
            const component = this.components[componentType];
            const components: ComponentData[] = entity[this.componentsPropertyName];
            if (component && components) {
                const index = components.findIndex(componentData => componentData.type === componentType);
                if (index !== -1) {
                    components.splice(index, 1);
                }
            }
        } else {
            delete entity[this.componentsPropertyName];
        }

        return this;
    }

    public updateEntityComponents(entity: any, elapsedTime?: number, actionsDispatcher?: ActionsDispatcher): ComponentSystem {
        if (entity[this.componentsPropertyName]) {
            entity[this.componentsPropertyName].forEach((componentData: ComponentData) => {
                const component = this.components[componentData.type];
                if (component) {
                    const isUpdate = component.isUpdates;
                    if (!isUpdate || isUpdate({entity, elapsedTime, componentData: componentData.data, actionsDispatcher})) {
                        const eventPayload = component.componentHandler
                            .update({entity, elapsedTime, componentData: componentData.data, actionsDispatcher});
                        if (eventPayload) {
                            this.addEvent({type: componentData.type, payload: eventPayload});
                        }
                    }
                }
            });
        }
        return this;
    }

    public clearEvents(): ComponentSystem {
        this.events = [];
        return this;
    }

    public handleEvents(eventCallback: (componentEvent: ComponentEvent) => void): ComponentSystem {
        this.events
            .forEach(event => eventCallback(event));
        return this;
    }

    private addEvent(event: ComponentEvent): ComponentSystem {
        this.events.push(event);
        return this;
    }
}
