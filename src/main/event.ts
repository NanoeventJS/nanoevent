export type EventListener<T> = (event: T) => void;

interface ListenerEntry<T> {
    listener: EventListener<T>;
    once: boolean;
}

export type ExtractEventType<T extends Event<any>> = T extends Event<infer R> ? R : never;

export class Event<T> {
    private listeners: ListenerEntry<T>[] = [];

    on(listener: EventListener<T>): () => void {
        this.listeners.push({ listener, once: false });
        return () => this.off(listener);
    }

    once(listener: EventListener<T>): () => void {
        this.listeners.push({ listener, once: true });
        return () => this.off(listener);
    }

    off(listener: EventListener<T>) {
        const i = this.listeners.findIndex(_ => _.listener === listener);
        if (i > -1) {
            this.listeners.splice(i, 1);
        }
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
