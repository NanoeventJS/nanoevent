import assert from 'assert';

import { Event } from '../main/index.js';

interface Data { foo: number }

describe('Event', () => {

    it('calls standard listener multiple times', () => {
        const emitted: Data[] = [];
        const emitter = new Event<Data>();
        emitter.on(data => emitted.push(data));
        emitter.emit({ foo: 1 });
        emitter.emit({ foo: 2 });
        emitter.emit({ foo: 3 });
        assert.deepStrictEqual(emitted, [
            { foo: 1 },
            { foo: 2 },
            { foo: 3 },
        ]);
    });

    it('delivers to multiple listeners', () => {
        const emitted1: Data[] = [];
        const emitted2: Data[] = [];
        const emitter = new Event<Data>();
        emitter.on(data => emitted1.push(data));
        emitter.on(data => emitted2.push(data));
        emitter.emit({ foo: 1 });
        assert.deepStrictEqual(emitted1, [{ foo: 1 }]);
        assert.deepStrictEqual(emitted2, [{ foo: 1 }]);
    });

    it('unsubscribes by calling a function', () => {
        const emitted: Data[] = [];
        const emitter = new Event<Data>();
        const unsubscribe = emitter.on(data => emitted.push(data));
        emitter.emit({ foo: 1 });
        unsubscribe();
        emitter.emit({ foo: 2 });
        assert.deepStrictEqual(emitted, [{ foo: 1 }]);
    });

    it('calls single-subscription listeners once', () => {
        const emitted: Data[] = [];
        const emitter = new Event<Data>();
        emitter.once(data => emitted.push(data));
        emitter.emit({ foo: 1 });
        emitter.emit({ foo: 2 });
        assert.deepStrictEqual(emitted, [{ foo: 1 }]);
    });

    it('unsubscribes single-subscription listeners', () => {
        const emitted: Data[] = [];
        const emitter = new Event<Data>();
        const unsubscribe = emitter.once(data => emitted.push(data));
        unsubscribe();
        emitter.emit({ foo: 1 });
        assert.deepStrictEqual(emitted, []);
    });

    it('invokes listeners in groups', () => {
        let count = 0;
        const emitter = new Event<Data>();
        for (let g = 0; g < 1000; g++) {
            for (let l = 0; l < 1000; l++) {
                emitter.on(ev => {
                    count += ev.foo;
                }, g);
            }
        }
        emitter.emit({ foo: 1 });
        assert.strictEqual(count, 1000_000);
    });

});
