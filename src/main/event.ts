export type EventListener<T> = (event: T) => void;

export type ListenerGroup<T> = Set<EventListener<T>>;

export type EventSubscription = () => void;

export class Event<T> {
    protected _groups = new Map<any, ListenerGroup<T>>();

    on(listener: EventListener<T>, group: any = Symbol()): EventSubscription {
        let set = this._groups.get(group);
        if (!set) {
            set = new Set();
            this._groups.set(group, set);
        }
        set.add(listener);
        return () => this.remove(listener, group);
    }

    once(listener: EventListener<T>, group: any = Symbol()): EventSubscription {
        const wrapper: EventListener<T> = ev => {
            listener(ev);
            this.remove(wrapper, group);
        };
        return this.on(wrapper, group);
    }

    remove(listener: EventListener<T>, group: any,) {
        const set = this._groups.get(group);
        if (set) {
            set.delete(listener);
            if (set.size === 0) {
                this._groups.delete(group);
            }
        }
    }

    removeAll(group: any) {
        this._groups.delete(group);
    }

    emit(event: T) {
        for (const set of this._groups.values()) {
            for (const listener of set) {
                listener(event);
            }
        }
    }

}
