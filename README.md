# [WIP] RabbitMQ AMQP 1.0 JavaScript Client

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

## TODO

Investigate use of **WebSockets** VS **Sockets** for use on **browser** VS **NodeJS**.
