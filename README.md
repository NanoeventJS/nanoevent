# Type-safe Event Emitter

Simple C#-style events (i.e. an emitter per event type).

```ts
interface ResizeEvent { oldSize: number, newSize: number }

const resized = new Event<ResizeEvent>();
resized.on(ev => console.log(`Resized from ${ev.oldSize} to ${ev.newSize}`));
resized.emit({ oldSize: 3, newSize: 5 });
```

## Highlights

- strongly typed
- no dependencies
- super-lightweight (adds just few hundred bytes to bundle size)
- no fancy features, only bare essentials are supported

## Usage

```ts
import { Event } from 'typesafe-event';

interface WeatherChangedEvent {
    oldWeather: Weather;
    newWeather: Weather;
}

// The event object is created for each event type
const weatherChanged = new Event<WeatherChangedEvent>();

// Basic subscription: ev has type WeatherChangedEvent
weatherChanged.on(ev => {
    console.log(`Weather has changed from ${ev.oldWeather} to ${ev.newWeather}`);
});

// Basic emitting: the payload should have type WeatherChangedEvent
weatherChanged.emit({
    oldWeather: { /* ... */ },
    newWeather: { /* ... */ },
});

// Only-once subscription
weatherChanged.once(ev => console.log(`Weather has changed, but I won't bother you again`));

// .on and .once return an unsubscribe function
const unsubscribe = weatherChanged.on(ev => {
    if (isGoodWeather(ev.newWeather)) {
        console.log(`Finally, a good weather!`);
        unsubscribe();
    }
});
```

It is advisable to adopt a naming conventions for the events and payload types.

Also, it's often convenient to group all related events into a single "event bus":

```ts
import { Event } from 'typesafe-event';

class ChatEvents {
    roomCreated = new Event<Room>();
    roomDestroyed = new Event<Room>();
    message = new Event<Message>();
    personJoined = new Event<Person>();
    personLeft = new Event<Person>();
    personEntered = new Event<{ door: Door, person: Person }>();
}
```
