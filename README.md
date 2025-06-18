# RabbitMQ AMQP 1.0 JavaScript Client

This library is meant to be used with RabbitMQ 4.0. </br>
Suitable for testing in pre-production environments. The public API(s) could change. 

[![Build Status](https://github.com/coders51/rabbitmq-amqp-js-client/actions/workflows/main.yml/badge.svg)](https://github.com/coders51/rabbitmq-amqp-js-client/actions)

# Table of Contents

- [Installing via NPM](#installing-via-npm)

- [Getting started](#getting-started)

- [Resources](#resources)

- [Roadmap](#roadmap)

## Installing via npm

The client is distributed via **npm**:

```bash
 npm install rabbitmq-amqp-js-client
```

## Getting started

**NOTE:** This is just a first example and will be replaced with a reference to the _examples folder_

The following example demonstrates how to create an environment, open a connection, and use the management to create and delete queues, exchanges, and bindings.

```typescript
const environment = createEnvironment({
  host: "localhost",
  port: 5672,
  username: "rabbit",
  password: "rabbit",
})

const connection = await environment.createConnection()

const management = connection.management()

const queue = await management.declareQueue("test")

const exchange = await management.declareExchange("exchange", { type: "topic" })
const secondExchange = await management.declareExchange("exchange-dest", { type: "topic" })

const bindingToQueue = await management.bind("foo", { source: exchange, destination: queue })
const bindingToExchange = await management.bind("foo", { source: exchange, destination: secondExchange })

await management.unbind("foo", { source: exchange, destination: queue })
await management.unbind("foo", { source: exchange, destination: secondExchange })

await management.deleteExchange("exchange")
await management.deleteExchange("exchange-dest")
await management.deleteQueue("test")

management.close()
await connection.close()
await environment.close()
```


## Resources

- [Reference library for AMQP 1.0](https://github.com/amqp/rhea)
- [AMQP 1.0 documentation](https://www.rabbitmq.com/docs/amqp)
- [AMQP 1.0 over WebSocket](https://www.rabbitmq.com/blog/2025/04/16/amqp-websocket) (blog post)
- [.Net client](https://github.com/rabbitmq/rabbitmq-amqp-dotnet-client) (reference implementation)

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
