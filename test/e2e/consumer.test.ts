import { Management } from "../../src/index.js"
import { afterEach, beforeEach, describe, expect, test } from "vitest"
import { eventually, host, password, port, username, cleanRabbit } from "../support/util.js"
import { createEnvironment, Environment } from "../../src/environment.js"
import { Connection } from "../../src/connection.js"
import { Queue } from "../../src/queue.js"
import { Exchange } from "../../src/exchange.js"
import { createAmqpMessage } from "../../src/message.js"

describe("Consumer", () => {
  let environment: Environment
  let connection: Connection
  let management: Management
  let queue: Queue
  let exchange: Exchange

  const exchangeName = "test-exchange"
  const queueName = "test-queue"
  const bindingKey = "test-binding"

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

    const consumer = await connection.createConsumer(queueName, {
      messageHandler: (message) => {
        received = message.body
      },
    })
    consumer.start()

    await eventually(() => {
      expect(received).to.be.eql(expectedBody)
    })
  })

  test.skip("consumer can handle message on exchange, destination on message", async () => {
    const publisher = await connection.createPublisher()
    const expectedBody = "ciao"
    await publisher.publish(
      createAmqpMessage({
        body: expectedBody,
        destination: { exchange: { name: exchangeName, routingKey: bindingKey } },
      })
    )
    let received: string = ""

    const consumer = await connection.createConsumer(queueName, {
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

    const consumer = await connection.createConsumer(queueName, {
      messageHandler: (message) => {
        received = message.body
      },
    })
    consumer.start()

    await eventually(() => {
      expect(received).to.be.eql(expectedBody)
    })
  })
})
