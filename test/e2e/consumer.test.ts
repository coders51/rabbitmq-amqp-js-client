import { Management } from "../../src/index.js"
import { afterEach, beforeEach, describe, expect, test } from "vitest"
import { eventually, host, password, port, username, cleanRabbit } from "../support/util.js"
import { createEnvironment, Environment } from "../../src/environment.js"
import { Connection } from "../../src/connection.js"
import { Queue } from "../../src/queue.js"
import { Exchange } from "../../src/exchange.js"
import { createAmqpMessage } from "../../src/message.js"
import { Offset } from "../../src/utils.js"

describe("Consumer", () => {
  let environment: Environment
  let connection: Connection
  let management: Management
  let queue: Queue
  let exchange: Exchange

  const exchangeName = "test-exchange"
  const queueName = "test-queue"
  const bindingKey = "test-binding"
  const streamName = "test-stream"

  beforeEach(async () => {
    environment = createEnvironment({
      host,
      port,
      username,
      password,
    })
    connection = await environment.createConnection()
    management = connection.management()
    queue = await management.declareQueue(queueName)
    await management.declareQueue(streamName, { type: "stream" })
    exchange = await management.declareExchange(exchangeName)
    await management.bind(bindingKey, { source: exchange, destination: queue })
  })

  afterEach(async () => {
    try {
      await cleanRabbit({ match: /test-/ })
      await connection.close()
      await environment.close()
    } catch (error) {
      console.error(error)
    }
  })

  test("consumer can handle message on exchange", async () => {
    const publisher = await connection.createPublisher({ exchange: { name: exchangeName, routingKey: bindingKey } })
    const expectedBody = "ciao"
    await publisher.publish(createAmqpMessage({ body: expectedBody }))
    let received: string = ""

    const consumer = await connection.createConsumer({
      queue: { name: queueName },
      messageHandler: (message) => {
        received = message.body
      },
    })
    consumer.start()

    await eventually(() => {
      expect(received).to.be.eql(expectedBody)
    })
  })

  test("consumer can handle message on exchange, destination on message", async () => {
    const publisher = await connection.createPublisher()
    const expectedBody = "ciao"
    await publisher.publish(
      createAmqpMessage({
        body: expectedBody,
        destination: { exchange: { name: exchangeName, routingKey: bindingKey } },
      })
    )
    let received: string = ""

    const consumer = await connection.createConsumer({
      queue: { name: queueName },
      messageHandler: (message) => {
        received = message.body
      },
    })
    consumer.start()

    await eventually(() => {
      expect(received).to.be.eql(expectedBody)
    })
  })

  test("consumer can handle message on queue", async () => {
    const publisher = await connection.createPublisher({ queue: { name: queueName } })
    const expectedBody = "ciao"
    await publisher.publish(
      createAmqpMessage({
        body: expectedBody,
      })
    )
    let received: string = ""

    const consumer = await connection.createConsumer({
      queue: { name: queueName },
      messageHandler: (message) => {
        received = message.body
      },
    })
    consumer.start()

    await eventually(() => {
      expect(received).to.be.eql(expectedBody)
    })
  })

  test("consumer can handle message on stream", async () => {
    const publisher = await connection.createPublisher({ queue: { name: streamName } })
    const expectedBody = "ciao"
    await publisher.publish(
      createAmqpMessage({
        body: expectedBody,
      })
    )
    let received: string = ""

    const consumer = await connection.createConsumer({
      stream: {
        name: streamName,
        offset: Offset.first(),
      },
      messageHandler: (message) => {
        received = message.body
      },
    })
    consumer.start()

    await eventually(() => {
      expect(received).to.be.eql(expectedBody)
    })
  })

  test("consumer can handle message on stream with message filters", async () => {
    const publisher = await connection.createPublisher({ queue: { name: streamName } })
    const filteredMessage = createAmqpMessage({
      body: "filtered",
      annotations: { "x-stream-filter-value": "invoices" },
    })
    const discardedMessage = createAmqpMessage({
      body: "filtered",
      annotations: { "x-stream-filter-value": "test" },
    })
    await publisher.publish(filteredMessage)
    await publisher.publish(discardedMessage)
    let received: string = ""

    const consumer = await connection.createConsumer({
      stream: {
        name: streamName,
        offset: Offset.first(),
        matchUnfiltered: true,
        filterValues: ["invoices"],
      },
      messageHandler: (message) => {
        if (message.message_annotations && ["invoices"].includes(message.message_annotations["x-stream-filter-value"]))
          received = message.body
      },
    })
    consumer.start()

    await eventually(() => {
      expect(received).to.be.eql("filtered")
    })
  })
})
