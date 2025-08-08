import { Management } from "../../src/index.js"
import { afterEach, beforeEach, describe, expect, test } from "vitest"
import {
  createQueue,
  existsQueue,
  eventually,
  createExchange,
  existsExchange,
  getQueueInfo,
  host,
  password,
  port,
  username,
  getExchangeInfo,
  existsBinding,
  cleanRabbit,
  generateToken,
} from "../support/util.js"
import { createEnvironment, Environment } from "../../src/environment.js"
import { Connection } from "../../src/connection.js"

describe("Management", () => {
  let environment: Environment
  let connection: Connection
  let management: Management

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
    await cleanRabbit({ match: /test-/ })
  })

  afterEach(async () => {
    try {
      await cleanRabbit({ match: /test-/ })
      management.close()
      await connection.close()
      await environment.close()
    } catch (error) {
      console.error(error)
    }
  })

  test("refresh the token through the /auth/tokens endpoint", async () => {
    const newToken = generateToken(username, 5)

    const result = await management.refreshToken(newToken)

    expect(result).to.eql(true)
  })

  describe("queues", async () => {
    test("create a default classic queue through the management", async () => {
      const queue = await management.declareQueue(queueName)

      await eventually(async () => {
        const queueInfo = await getQueueInfo(queue.getInfo.name)
        expect(queueInfo.ok).to.eql(true)
        expect(queue.getInfo.arguments).to.eql(queueInfo.body.arguments)
        expect(queue.getInfo.autoDelete).to.eql(queueInfo.body.auto_delete)
        expect(queue.getInfo.durable).to.eql(queueInfo.body.durable)
        expect(queue.getInfo.exclusive).to.eql(queueInfo.body.exclusive)
        expect(queue.getInfo.consumerCount).to.eql(queueInfo.body.consumers)
        expect(queue.getInfo.messageCount).to.eql(queueInfo.body.messages)
        expect(queue.getInfo.type).to.eql(queueInfo.body.type)
        expect(queue.getInfo.leader).to.eql(queueInfo.body.node)
      })
    })

    test("create a classic queue through the management", async () => {
      const queue = await management.declareQueue(queueName, {
        type: "classic",
        maxPriority: 123,
        mode: "default",
        version: 1,
      })

      await eventually(async () => {
        const queueInfo = await getQueueInfo(queue.getInfo.name)
        expect(queueInfo.ok).to.eql(true)
        expect(queue.getInfo.arguments).to.eql(queueInfo.body.arguments)
        expect(queue.getInfo.autoDelete).to.eql(queueInfo.body.auto_delete)
        expect(queue.getInfo.durable).to.eql(queueInfo.body.durable)
        expect(queue.getInfo.exclusive).to.eql(queueInfo.body.exclusive)
        expect(queue.getInfo.consumerCount).to.eql(queueInfo.body.consumers)
        expect(queue.getInfo.messageCount).to.eql(queueInfo.body.messages)
        expect(queue.getInfo.type).to.eql(queueInfo.body.type)
        expect(queue.getInfo.leader).to.eql(queueInfo.body.node)
      })
    })

    test("create a quorum queue through the management", async () => {
      const queue = await management.declareQueue(queueName, {
        type: "quorum",
        deadLetterStrategy: "at-least-once",
        deliveryLimit: 123,
        initialGroupSize: 234,
        targetGroupSize: 456,
      })

      await eventually(async () => {
        const queueInfo = await getQueueInfo(queue.getInfo.name)
        expect(queueInfo.ok).to.eql(true)
        expect(queue.getInfo.arguments).to.eql(queueInfo.body.arguments)
        expect(queue.getInfo.autoDelete).to.eql(queueInfo.body.auto_delete)
        expect(queue.getInfo.durable).to.eql(queueInfo.body.durable)
        expect(queue.getInfo.exclusive).to.eql(queueInfo.body.exclusive)
        expect(queue.getInfo.consumerCount).to.eql(queueInfo.body.consumers)
        expect(queue.getInfo.messageCount).to.eql(queueInfo.body.messages)
        expect(queue.getInfo.type).to.eql(queueInfo.body.type)
        expect(queue.getInfo.leader).to.eql(queueInfo.body.node)
      })
    })

    test("delete a queue through the management", async () => {
      await createQueue(queueName)

      const result = await management.deleteQueue(queueName)

      await eventually(async () => {
        expect(await existsQueue(queueName)).to.eql(false)
        expect(result).to.eql(true)
      })
    })

    test("get info of a queue through the management", async () => {
      await createQueue(queueName)

      const result = await management.getQueueInfo(queueName)

      await eventually(async () => {
        const queueInfo = await getQueueInfo(queueName)
        expect(result.getInfo.arguments).to.eql(queueInfo.body.arguments)
        expect(result.getInfo.autoDelete).to.eql(queueInfo.body.auto_delete)
        expect(result.getInfo.durable).to.eql(queueInfo.body.durable)
        expect(result.getInfo.exclusive).to.eql(queueInfo.body.exclusive)
        expect(result.getInfo.consumerCount).to.eql(queueInfo.body.consumers)
        expect(result.getInfo.messageCount).to.eql(queueInfo.body.messages)
        expect(result.getInfo.type).to.eql(queueInfo.body.type)
        expect(result.getInfo.leader).to.eql(queueInfo.body.node)
      })
    })
  })

  describe("exchanges", async () => {
    test("create an exchange through the management", async () => {
      const exchange = await management.declareExchange(exchangeName, {
        type: "headers",
        auto_delete: true,
        durable: false,
      })

      await eventually(async () => {
        const exchangeInfo = await getExchangeInfo(exchange.getInfo.name)
        expect(exchangeInfo.ok).to.eql(true)
        expect(exchange.getInfo.name).to.eql(exchangeInfo.body.name)
        expect(exchange.getInfo.arguments).to.eql(exchangeInfo.body.arguments)
        expect(exchange.getInfo.autoDelete).to.eql(exchangeInfo.body.auto_delete)
        expect(exchange.getInfo.durable).to.eql(exchangeInfo.body.durable)
        expect(exchange.getInfo.type).to.eql(exchangeInfo.body.type)
      })
    })

    test("create an exchange with custom type", async () => {
      const customType = "x-consistent-hash" // requires plugin rabbitmq_consistent_hash_exchange enabled
      const exchange = await management.declareExchange(exchangeName, {
        type: customType,
        auto_delete: true,
        durable: false,
      })

      await eventually(async () => {
        const exchangeInfo = await getExchangeInfo(exchange.getInfo.name)
        expect(exchangeInfo.ok).to.eql(true)
        expect(exchangeInfo.body.type).to.eql(customType)
      })
    })

    test("delete an exchange through the management", async () => {
      await createExchange(exchangeName)
      await eventually(async () => {
        expect(await existsExchange(exchangeName)).to.eql(true)
      })

      const result = await management.deleteExchange(exchangeName)

      await eventually(async () => {
        expect(await existsExchange(exchangeName)).to.eql(false)
        expect(result).eql(true)
      })
    })
  })

  describe("bindings", async () => {
    test("create a binding from exchange to queue through the management", async () => {
      const exchange = await management.declareExchange(exchangeName)
      const queue = await management.declareQueue(queueName)

      await management.bind(bindingKey, { source: exchange, destination: queue })

      await eventually(async () => {
        expect(await existsBinding({ source: exchangeName, destination: queueName, type: "exchangeToQueue" })).to.eql(
          true
        )
      })
    })

    test("create a binding from exchange to exchange through the management", async () => {
      const exchange1 = await management.declareExchange(exchangeName)
      const exchange2 = await management.declareExchange(exchangeName + "-2")

      await management.bind(bindingKey, { source: exchange1, destination: exchange2 })

      await eventually(async () => {
        expect(
          await existsBinding({ source: exchangeName, destination: exchangeName + "-2", type: "exchangeToExchange" })
        ).to.eql(true)
      })
    })

    test("delete a binding from exchange to queue with no arguments through the management", async () => {
      const exchange = await management.declareExchange(exchangeName)
      const queue = await management.declareQueue(queueName)

      await management.unbind(bindingKey, { source: exchange, destination: queue })

      await eventually(async () => {
        expect(await existsBinding({ source: exchangeName, destination: queueName, type: "exchangeToQueue" })).to.eql(
          false
        )
        expect(await existsQueue(queue.getInfo.name)).to.eql(true)
        expect(await existsExchange(exchange.getInfo.name)).to.eql(true)
      })
    })

    test("delete a binding from exchange to exchange with no arguments through the management", async () => {
      const exchange = await management.declareExchange(exchangeName)
      const exchange2 = await management.declareExchange(exchangeName + "-2")

      await management.unbind(bindingKey, { source: exchange, destination: exchange2 })

      await eventually(async () => {
        expect(
          await existsBinding({ source: exchangeName, destination: exchangeName + "-2", type: "exchangeToExchange" })
        ).to.eql(false)
        expect(await existsExchange(exchange.getInfo.name)).to.eql(true)
        expect(await existsExchange(exchangeName + "-2")).to.eql(true)
      })
    })
  })
})
