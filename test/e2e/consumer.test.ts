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
} from "../support/util.js"
import { createEnvironment, Environment } from "../../src/environment.js"
import { Connection } from "../../src/connection.js"
import { Queue } from "../../src/queue.js"
import { Exchange } from "../../src/exchange.js"
import { Binding } from "../../src/binding.js"

describe("Consumer", () => {
  let environment: Environment
  let connection: Connection
  let management: Management
  let queue: Queue
  let exchange: Exchange
  let binding: Binding

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
    binding = await management.bind(bindingKey, { source: exchange, destination: queue })
    await cleanRabbit({ match: /test-/ })
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

  test("create consumer", async () => {
    const consumer = await connection.createConsumer(queueName, {
      messageHandler: async (message) => {
        console.log(message)
      },
    })
    await consumer.start()
  })
})
