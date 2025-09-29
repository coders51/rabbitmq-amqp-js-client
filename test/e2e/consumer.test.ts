import { Management } from "../../src/index.js"
import { afterEach, beforeEach, describe, expect, test } from "vitest"
import { eventually, host, password, port, username, cleanRabbit, wait } from "../support/util.js"
import { createEnvironment, Environment } from "../../src/environment.js"
import { Connection } from "../../src/connection.js"
import { Queue } from "../../src/queue.js"
import { Exchange } from "../../src/exchange.js"
import { createAmqpMessage } from "../../src/message.js"
import { Offset } from "../../src/utils.js"
import { Message } from "rhea"

describe("Consumer", () => {
  let environment: Environment
  let connection: Connection
  let management: Management
  let queue: Queue
  let deadLetterQueue: Queue
  let exchange: Exchange
  let deadLetterExchange: Exchange

  const exchangeName = "test-exchange"
  const queueName = "test-queue"
  const discardQueueName = "test-discard-queue"
  const requeueQueueName = "test-requeue-queue"
  const bindingKey = "test-binding"
  const streamName = "test-stream"
  const deadLetterExchangeName = "test-dead-letter-exchange"
  const deadLetterQueueName = "test-dead-letter-queue"
  const deadLetterBindingKey = "test-dead-letter-binding"

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
    await management.declareQueue(discardQueueName, {
      type: "quorum",
      durable: true,
      arguments: {
        "x-dead-letter-exchange": deadLetterExchangeName,
        "x-dead-letter-routing-key": deadLetterBindingKey,
      },
    })
    await management.declareQueue(requeueQueueName, {
      type: "quorum",
      durable: true,
    })
    deadLetterQueue = await management.declareQueue(deadLetterQueueName, { exclusive: true })
    exchange = await management.declareExchange(exchangeName)
    deadLetterExchange = await management.declareExchange(deadLetterExchangeName, { type: "fanout", auto_delete: true })
    await management.bind(bindingKey, { source: exchange, destination: queue })
    await management.bind(deadLetterBindingKey, { source: deadLetterExchange, destination: deadLetterQueue })
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

  test("consumer can handle a message published to an exchange", async () => {
    const publisher = await connection.createPublisher({ exchange: { name: exchangeName, routingKey: bindingKey } })
    const expectedBody = "ciao"
    await publisher.publish(createAmqpMessage({ body: expectedBody }))
    let received: string = ""

    const consumer = await connection.createConsumer({
      queue: { name: queueName },
      messageHandler: (context, message) => {
        context.accept()
        received = message.body
      },
    })
    consumer.start()

    await eventually(async () => {
      expect(received).to.be.eql(expectedBody)
    })
  })

  test("consumer can handle a message published to an exchange with the destination directly on the message", async () => {
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
      messageHandler: (context, message) => {
        context.accept()
        received = message.body
      },
    })
    consumer.start()

    await eventually(() => {
      expect(received).to.be.eql(expectedBody)
    })
  })

  test("consumer can handle a message published to a queue", async () => {
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
      messageHandler: (context, message) => {
        context.accept()
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
      messageHandler: (context, message) => {
        context.discard()
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
      messageHandler: (context, message) => {
        if (
          message.message_annotations &&
          ["invoices"].includes(message.message_annotations["x-stream-filter-value"])
        ) {
          received = message.body
        }
        context.accept()
      },
    })
    consumer.start()

    await eventually(() => {
      expect(received).to.be.eql("filtered")
    })
  })

  test("consumer can handle message on stream with sql filters", async () => {
    const publisher = await connection.createPublisher({ queue: { name: streamName } })
    const filteredMessage = createAmqpMessage({
      body: "my body",
      message_properties: {
        subject: "foo",
      },
    })
    const discardedMessage = createAmqpMessage({
      body: "discard me",
      message_properties: {
        subject: "bar",
      },
    })
    await publisher.publish(filteredMessage)
    await publisher.publish(discardedMessage)
    let received: string = ""

    const consumer = await connection.createConsumer({
      stream: {
        name: streamName,
        offset: Offset.first(),
        matchUnfiltered: false,
        sqlFilter: "properties.subject = '123'",
      },
      messageHandler: (context, message) => {
        console.log("message", message.subject)
        if (message.subject && message.subject == "foo") {
          console.log("hello ")
          received = message.body
        }
        context.accept()
      },
    })
    consumer.start()

    await eventually(() => {
      expect(received).to.be.eql("my body")
    })
  })

  test("consumer can discard a message published to a queue", async () => {
    const publisher = await connection.createPublisher({ queue: { name: discardQueueName } })
    const expectedBody = "ciao"
    await publisher.publish(
      createAmqpMessage({
        body: expectedBody,
      })
    )
    let received: string = ""

    const consumer = await connection.createConsumer({
      queue: { name: discardQueueName },
      messageHandler: (context, message) => {
        context.discard()
        received = message.body
      },
    })
    consumer.start()

    await eventually(async () => {
      expect(received).to.be.eql(expectedBody)
      const deadLetterInfo = await management.getQueueInfo(deadLetterQueueName)
      expect(deadLetterInfo.getInfo.messageCount).eql(1)
    })
  })

  test("consumer can discard a message with annotations in a queue", async () => {
    const publisher = await connection.createPublisher({ queue: { name: discardQueueName } })
    const expectedBody = "ciao"
    await publisher.publish(
      createAmqpMessage({
        body: expectedBody,
      })
    )
    let receivedAnnotationValue: string | undefined = ""
    const consumer = await connection.createConsumer({
      queue: { name: discardQueueName },
      messageHandler: (context) => {
        context.discard({ "x-opt-annotation-key": "annotation-value" })
      },
    })
    consumer.start()
    await wait(2000)
    consumer.close()
    await wait(3000)

    const consumerDeadLetter = await connection.createConsumer({
      queue: { name: deadLetterQueueName },
      messageHandler: (context, message) => {
        receivedAnnotationValue = message.message_annotations
          ? message.message_annotations["x-opt-annotation-key"]
          : undefined
        context.accept()
      },
    })
    consumerDeadLetter.start()
    await wait(3000)

    await eventually(() => {
      expect(receivedAnnotationValue).eql("annotation-value")
    })
  }, 15000)

  test("consumer can requeue a message in a queue", async () => {
    let toRequeue = true
    const messages: Message[] = []
    const consumer = await connection.createConsumer({
      queue: { name: requeueQueueName },
      messageHandler: (context, message) => {
        messages.push(message)
        if (toRequeue) {
          toRequeue = false
          context.requeue()
          return
        }
        context.accept()
      },
    })

    consumer.start()
    const publisher = await connection.createPublisher({ queue: { name: requeueQueueName } })
    const expectedBody = "ciao"
    await publisher.publish(
      createAmqpMessage({
        body: expectedBody,
      })
    )

    await eventually(async () => {
      expect(toRequeue).eql(false)
      expect(messages).lengthOf(2)
    })
  })

  test("consumer can requeue a message with annotations in a queue", async () => {
    let toRequeue = true
    const messages: Message[] = []
    const consumer = await connection.createConsumer({
      queue: { name: requeueQueueName },
      messageHandler: (context, message) => {
        messages.push(message)
        if (toRequeue) {
          toRequeue = false
          context.requeue({ "x-opt-annotation-key": "annotation-value" })
          return
        }
        context.accept()
      },
    })

    consumer.start()
    const publisher = await connection.createPublisher({ queue: { name: requeueQueueName } })
    const expectedBody = "ciao"
    await publisher.publish(
      createAmqpMessage({
        body: expectedBody,
      })
    )

    await eventually(async () => {
      expect(toRequeue).eql(false)
      expect(messages).lengthOf(2)
      expect(messages[0].message_annotations!["x-opt-annotation-key"]).toBeUndefined()
      expect(messages[0].message_annotations!["x-delivery-count"]).toBeUndefined()
      expect(messages[1].message_annotations!["x-opt-annotation-key"]).toEqual("annotation-value")
      expect(messages[1].message_annotations!["x-delivery-count"]).toEqual(1)
    })
  }, 15000)
})
