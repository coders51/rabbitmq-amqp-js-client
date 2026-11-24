# Client examples

- [Basic Usage](./index.cjs) - Producer and Consumer example without reconnection (CommonJS), run it with `npm start`
- [Socket Example](./socket_example.js) - The same Producer and Consumer example as an ES module
- [WebSocket Example](./websocket_example.html) - Sample using WebSocket connections from the browser
- [Consumer Priority](./consumer_priority.js) - Two consumers with different priorities on the same queue (RabbitMQ 4.3+)
- [Stream Initial Offset](./stream_initial_offset.js) - A stream whose first message gets a configured offset instead of 0 (RabbitMQ 4.4+)

The WebSocket example loads the browser bundle from `../dist/index.umd.js`, so run `npm run build` in the
root folder first. The broker needs the `rabbitmq_web_amqp` plugin, listening on port 15678.
