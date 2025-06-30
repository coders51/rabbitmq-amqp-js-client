import { afterEach, beforeEach, describe, expect, test } from "vitest"
import { createEnvironment, Environment } from "../../src/environment.js"
import {
  host,
  port,
  username,
  password,
  numberOfConnections,
  eventually,
  createExchange,
  createQueue,
  createBinding,
  cleanRabbit,
} from "../support/util.js"
import { Connection } from "../../src/connection.js"

describe("Connection", () => {
  let environment: Environment
  let connection: Connection
  const exchangeName = "test-exchange"
  const exchangeName2 = "test-exchange-2"
  const queueName = "test-queue"
  const bindingKey = "test-key"
  const bindingKey2 = "test-key-2"

  beforeEach(async () => {
    environment = createEnvironment({
      host,
      port,
      username,
      password,
    })
    connection = await environment.createConnection()
    await createExchange(exchangeName)
    await createExchange(exchangeName2)
    await createQueue(queueName)
    await createBinding(bindingKey, { source: exchangeName, destination: queueName, type: "exchangeToQueue" })
    await createBinding(bindingKey2, { source: exchangeName, destination: exchangeName2, type: "exchangeToExchange" })
  })

  afterEach(async () => {
    await cleanRabbit({ match: /test-/ })
    await connection.close()
    await environment.close()
  })

  test("closing the connection", async () => {
    const newConnection = await environment.createConnection()

    await newConnection.close()

    await eventually(async () => {
      expect(await numberOfConnections()).to.eql(1)
    })
  })

  test("create a publisher linked to no exchange or queue", async () => {
    await connection.createPublisher()

    expect(connection.publishers.size).eql(1)
  })

  test("create a publisher linked to an exchange", async () => {
    await connection.createPublisher({ exchange: { name: exchangeName } })

    expect(connection.publishers.size).eql(1)
  })

  test("create a publisher linked to an exchange", async () => {
    await connection.createPublisher({ exchange: { name: exchangeName } })

    expect(connection.publishers.size).eql(1)
  })

  test("create a publisher linked to an exchange with exchange to queue binding", async () => {
    await connection.createPublisher({ exchange: { name: exchangeName, routingKey: bindingKey } })

    expect(connection.publishers.size).eql(1)
  })

  test("create a publisher linked to an exchange with exchange to exchange binding", async () => {
    await connection.createPublisher({ exchange: { name: exchangeName, routingKey: bindingKey2 } })

    expect(connection.publishers.size).eql(1)
  })

  test("create a publisher linked to a queue", async () => {
    await connection.createPublisher({ queue: { name: queueName } })

    expect(connection.publishers.size).eql(1)
  })

  test("close a publisher", async () => {
    const publisher = await connection.createPublisher({ exchange: { name: exchangeName } })

    publisher.close()

    expect(connection.publishers.size).eql(0)
  })

  test("closing the connection also closes the publisher", async () => {
    const newConnection = await environment.createConnection()
    await newConnection.createPublisher({ exchange: { name: exchangeName } })

    await newConnection.close()

    expect(newConnection.publishers.size).eql(0)
  })

  test("create a consumer linked to a queue", async () => {
    await connection.createConsumer(queueName, {
      messageHandler: async (msg) => {
        console.log(msg)
      },
    })

    expect(connection.consumers.size).eql(1)
  })

  test("close a consumer", async () => {
    const consumer = await connection.createConsumer(queueName, {
      messageHandler: async (msg) => {
        console.log(msg)
      },
    })

    consumer.close()

    expect(connection.consumers.size).eql(0)
  })

  test("closing the connection also closes the consumer", async () => {
    const newConnection = await environment.createConnection()
    await newConnection.createConsumer(queueName, {
      messageHandler: async (msg) => {
        console.log(msg)
      },
    })

    await newConnection.close()

    expect(newConnection.consumers.size).eql(0)
  })
})
