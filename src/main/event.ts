export type EventListener<T> = (event: T) => void;

export type ListenerGroup<T> = Set<EventListener<T>>;

export type EventSubscription = () => void;

export class Event<T> {
    protected _groups = new Map<any, ListenerGroup<T>>();
    protected _listenerToGroup = new Map<EventListener<T>, any>();

    on(listener: EventListener<T>, group: any = Symbol()): EventSubscription {
        let set = this._groups.get(group);
        if (!set) {
            set = new Set();
            this._groups.set(group, set);
        }
        set.add(listener);
        this._listenerToGroup.set(listener, group);
        return () => this.remove(group, listener);
    }

    once(listener: EventListener<T>, group: any = Symbol()): EventSubscription {
        const wrapper: EventListener<T> = ev => {
            listener(ev);
            this.remove(group, wrapper);
        };
        return this.on(wrapper, group);
    }

    off(listener: EventListener<T>) {
        const group = this._listenerToGroup.get(listener);
        if (group) {
            this.remove(group, listener);
        }
    }

    protected remove(group: any, listener: EventListener<T>) {
        const set = this._groups.get(group);
        if (set) {
            set.delete(listener);
            if (set.size === 0) {
                this._groups.delete(group);
            }
        }
        this._listenerToGroup.delete(listener);
    }

    removeAll(group: any) {
        const set = this._groups.get(group);
        this._groups.delete(group);
        if (set) {
            for (const listener of set) {
                this._listenerToGroup.delete(listener);
            }
        }
    }

    emit(event: T) {
        for (const listener of this._listenerToGroup.keys()) {
            listener(event);
        }
    }

}
