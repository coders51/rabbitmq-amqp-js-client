import { Management } from "../../src/index.js"
import { afterEach, beforeEach, describe, expect, test } from "vitest"
import {
  createQueue,
  eventually,
  existsExchange,
  deleteExchange,
  existsQueue,
  getQueueInfo,
  host,
  password,
  port,
  username,
} from "../support/util.js"
import { createEnvironment, Environment } from "../../src/environment.js"
import { Connection } from "../../src/connection.js"

describe("Management", () => {
  let environment: Environment
  let connection: Connection
  let management: Management

  const exchangeName = "test-exchange"

  beforeEach(async () => {
    environment = createEnvironment({
      host,
      port,
      username,
      password,
    })
    connection = await environment.createConnection()
    management = connection.management()
    await deleteExchange(exchangeName)
  })

  afterEach(async () => {
    try {
      await management.close()
      await connection.close()
      await environment.close()
      await deleteExchange(exchangeName)
    } catch (error) {
      console.error(error)
    }
  })

  test("create a queue through the management", async () => {
    const queue = await management.declareQueue("test-queue")

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
    await createQueue("test-queue")

    await management.deleteQueue("test-queue")

    await eventually(async () => {
      expect(await existsQueue("test-queue")).to.eql(false)
    })
  })

  test("create an exchange through the management", async () => {
    const exchangeInfo = management.declareExchange(exchangeName, {
      type: "headers",
      auto_delete: true,
      durable: false,
    })

    expect(exchangeInfo.name).to.eql(exchangeName)
    await eventually(async () => {
      expect(await existsExchange(exchangeInfo.name)).to.eql(true)
    })
  })
})
