# RabbitMQ AMQP 1.0 JavaScript Client

This library is meant to be used with RabbitMQ `4.x`. </br>

[![Build Status](https://github.com/coders51/rabbitmq-amqp-js-client/actions/workflows/main.yml/badge.svg)](https://github.com/coders51/rabbitmq-amqp-js-client/actions)

# Table of Contents

- [Installing via NPM](#installing-via-npm)

- [Getting started](#getting-started)

- [Consumer flow control](#consumer-flow-control)

- [Resources](#resources)

- [Connection recovery](#connection-recovery)

- [Roadmap](#roadmap)

## Installing via npm

The client is distributed via **npm**:

```bash
 npm install rabbitmq-amqp-js-client
```

## Getting started

Inside the [_examples_](./examples/) folder you can find a node project that shows how to use the library.

## Consumer flow control

By default the client relies on [rhea](https://github.com/amqp/rhea)'s credit window (1000 credits), so up to 1000
messages can be delivered to a consumer before any of them is settled. If your consumers process messages slowly, you
can bound the number of unsettled messages held by a consumer with `initialCredits`, similar to `basic.qos` (prefetch)
in AMQP 0.9.1 and to `initialCredits` in the
[other RabbitMQ AMQP 1.0 clients](https://www.rabbitmq.com/client-libraries/amqp-client-libraries):

```typescript
const consumer = await connection.createConsumer({
  queue: { name: "my-queue" },
  initialCredits: 10, // at most 10 unsettled messages delivered to this consumer
  messageHandler: (context, message) => {
    // ... process the message ...
    context.accept() // settling the message grants one more credit to the broker
  },
})
consumer.start()
```

Every time a message is settled (`accept`, `discard` or `requeue`) one credit is granted back to the broker, so the
consumer never holds more than `initialCredits` unsettled messages. For pre-settled consumers (`preSettled: true`)
messages are settled on arrival, so `initialCredits` bounds the number of in-flight messages instead.

## Resources

- [Reference library for AMQP 1.0](https://github.com/amqp/rhea)
- [AMQP 1.0 documentation](https://www.rabbitmq.com/docs/amqp)
- [AMQP 1.0 over WebSocket](https://www.rabbitmq.com/blog/2025/04/16/amqp-websocket) (blog post)
- [.Net client](https://github.com/rabbitmq/rabbitmq-amqp-dotnet-client) (reference implementation)

## Connection recovery

By default a connection reconnects automatically when it is lost; this can be tuned with the `reconnect`, `initialReconnectDelay`, `maxReconnectDelay` and `reconnectLimit` options of `createConnection`.

Automatic reconnection only applies to a connection that has been opened: when the first attempt fails, for example because the broker is not reachable, the promise returned by `createConnection` is rejected without retrying, and it is up to the application to try again. This is the same behaviour as the other [RabbitMQ AMQP 1.0 clients](https://www.rabbitmq.com/client-libraries/amqp-client-libraries).

## Roadmap

The interface shall be uniformed to all other clients in order to have [unified documentation](https://www.rabbitmq.com/client-libraries/amqp-client-libraries). While developing, keep in mind the support for **autoreconnect**.

1. Implement the management functions via AMQP

   - "REST style" send message
   - handling `senderLink`, `receiverLink`
   - generating exchanges, queues, bindings

2. Implementing **connections**

3. Implementing **environment**

4. Provide simple APIs for [publishing and consuming](https://www.rabbitmq.com/client-libraries/amqp-client-libraries#publishing)

5. (OPTIONAL) Autoreconnect (possibly [already managed by RHEA](https://github.com/amqp/rhea/blob/main/examples/reconnect/client.js))

6. (OPTIONAL) Metrics for **Prometheus**
