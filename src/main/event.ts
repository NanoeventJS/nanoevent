export type EventListener<T> = (event: T) => void;

interface ListenerEntry<T> {
    listener: EventListener<T>;
    once: boolean;
    group: any;
}

export type ExtractEventType<T extends Event<any>> = T extends Event<infer R> ? R : never;

export type EventSubscription = () => void;

export class Event<T> {
    private listeners: ListenerEntry<T>[] = [];

    on(listener: EventListener<T>, group: any = undefined): EventSubscription {
        this.listeners.push({ listener, once: false, group });
        return () => this.off(listener);
    }

    once(listener: EventListener<T>, group: any = undefined): EventSubscription {
        this.listeners.push({ listener, once: true, group });
        return () => this.off(listener);
    }

    off(listener: EventListener<T>) {
        const i = this.listeners.findIndex(_ => _.listener === listener);
        if (i > -1) {
            this.listeners.splice(i, 1);
        }
    }

    removeAll(group: any) {
        this.listeners = this.listeners.filter(_ => _.group !== group);
    }

    emit(event: T) {
        for (let i = 0; i < this.listeners.length; i++) {
            const { listener, once } = this.listeners[i];
            listener(event);
            if (once) {
                this.listeners.splice(i, 1);
                i -= 1;
            }
        }
    }

}
