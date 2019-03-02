// TODO: merge 'inits' and initialize?
export interface ComponentHandler<T = any> {
    type: string;
    inits?: T;
    update: UpdateFn<T>;
    initialize?: InitializeFn<T>;
    isOver?: (params: { entity: any, componentData: T}) => boolean;
}

export type InitializeFn<T> = (params: {entity: any, inits?: T}) => void;

export type UpdateFn<T> = (
    params: {
        entity?: any,
        elapsedTime?: number,
        componentData: T,
        actionsDispatcher?: ActionsDispatcher,
    }) => any;

export interface ComponentData<T = any> {
    type: string;
    data?: T;
}

export interface ComponentEvent {
    type: string;
    payload?: any;
}

export type ActionsDispatcher = (actionType: string, payload?: any) => any;

export interface ComponentSystem {
    registerComponentHandler<T>(componentHandler: ComponentHandler<T>): ComponentSystem;
    deregisterComponentHandler<T>(componentHandler?: ComponentHandler<T>): ComponentSystem;
    addIsUpdate<T>(componentType: string, isUpdate: UpdateFn<T>): ComponentSystem;
    removeIsUpdate(componentType: string): ComponentSystem;
    addComponentToEntity<T>(entity: any, componentType: string, inits?: T): ComponentSystem;
    getComponentsFromEntity<T>(entity: any, componentType?: string): Array<ComponentData<T>>;
    removeComponentFromEntity(entity: any, componentType?: string): ComponentSystem;
    updateEntityComponents(entity: any, elapsedTime: number, actionsDispatcher: ActionsDispatcher): ComponentSystem;
    clearEvents(): ComponentSystem;
    handleEvents(eventCallback: (componentEvent: ComponentEvent) => void): ComponentSystem;
}

export interface ComponentSystemConfig {
    register: any[];
}
