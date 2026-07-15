# RabbitMQ AMQP 1.0 JavaScript Client

This library is meant to be used with RabbitMQ `4.x`. </br>

[![Build Status](https://github.com/coders51/rabbitmq-amqp-js-client/actions/workflows/main.yml/badge.svg)](https://github.com/coders51/rabbitmq-amqp-js-client/actions)

# Table of Contents

- [Installing via NPM](#installing-via-npm)

- [Getting started](#getting-started)

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

### Connecting to a virtual host

By default the client connects to the default virtual host `/`. Set the optional `virtualHost` parameter to connect to a different one:

```js
const environment = rabbit.createEnvironment({
  host: "localhost",
  port: 5672,
  username: "guest",
  password: "guest",
  virtualHost: "my-vhost",
})
```

RabbitMQ selects the virtual host of an AMQP 1.0 connection through the `hostname` field of the `open` frame, using the `vhost:<name>` convention (see the [RabbitMQ AMQP 1.0 documentation](https://www.rabbitmq.com/docs/amqp#virtual-hosts)).

Over TLS this does not affect the server name sent for SNI: `virtualHost` only sets the `open` frame `hostname`, while the TLS server name is still derived from `host`.

When the virtual host does not exist, or the user has no permission on it, the broker closes the socket without sending an AMQP error frame. The promise returned by `createConnection` is rejected in that case, so the connection attempt fails rather than hanging.

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
