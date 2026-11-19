import { afterEach, beforeEach, describe, expect, test } from "vitest"
import { createEnvironment, Environment } from "../../src/environment.js"
import { Connection } from "../../src/connection.js"
import { createAmqpMessage } from "../../src/message.js"
import { brokerVersionAtLeast, cleanRabbit, eventually, host, password, port, username, wait } from "../support/util.js"

describe.skipIf(!(await brokerVersionAtLeast(4, 3)))("Consumer priority (RabbitMQ 4.3+)", () => {
  let environment: Environment
  let connection: Connection
  const queueName = "test-consumer-priority"

  beforeEach(async () => {
    environment = createEnvironment({ host, port, username, password })
    connection = await environment.createConnection()
    await connection.management().declareQueue(queueName, { type: "quorum" })
  })

  afterEach(async () => {
    try {
      await connection.close()
      await environment.close()
      await cleanRabbit({ match: /test-consumer-priority/ })
    } catch (error) {
      console.error(error)
    }
  })

  test("a consumer with a priority can be created", async () => {
    const consumer = await connection.createConsumer({
      queue: { name: queueName },
      priority: 10,
      messageHandler: () => {},
    })

    expect(consumer.id).toBeDefined()
  })

  test("a priority that is not a 32-bit integer is rejected", async () => {
    await expect(
      connection.createConsumer({ queue: { name: queueName }, priority: 1.5, messageHandler: () => {} })
    ).rejects.toThrow(/32-bit signed integer/)
    await expect(
      connection.createConsumer({ queue: { name: queueName }, priority: 2 ** 31, messageHandler: () => {} })
    ).rejects.toThrow(/32-bit signed integer/)
  })

  test("delivers every message to the higher priority consumer while it has credit", async () => {
    const messageCount = 20
    let highCount = 0
    let lowCount = 0
    const high = await connection.createConsumer({
      queue: { name: queueName },
      priority: 10,
      messageHandler: (ctx) => {
        ctx.accept()
        highCount++
      },
    })
    const low = await connection.createConsumer({
      queue: { name: queueName },
      priority: 1,
      messageHandler: (ctx) => {
        ctx.accept()
        lowCount++
      },
    })
    high.start()
    low.start()

    const publisher = await connection.createPublisher({ queue: { name: queueName } })
    for (let i = 0; i < messageCount; i++) {
      await publisher.publish(createAmqpMessage({ body: `message ${i}` }))
    }

    await eventually(() => expect(highCount).toBe(messageCount))
    await wait(300)
    expect(lowCount).toBe(0)
  })

  test("falls back to the lower priority consumer once the higher priority one runs out of credit", async () => {
    const receivedByHighPriority: string[] = []
    const receivedByLowPriority: string[] = []
    const highPriorityConsumer = await connection.createConsumer({
      queue: { name: queueName },
      priority: 10,
      initialCredits: 5,
      messageHandler: (_ctx, msg) => {
        receivedByHighPriority.push(msg.body)
      },
    })
    const lowPriorityConsumer = await connection.createConsumer({
      queue: { name: queueName },
      priority: 1,
      messageHandler: (ctx, msg) => {
        ctx.accept()
        receivedByLowPriority.push(msg.body)
      },
    })
    highPriorityConsumer.start()
    lowPriorityConsumer.start()

    const published = Array.from({ length: 10 }, (_, i) => `message ${i}`)
    const publisher = await connection.createPublisher({ queue: { name: queueName } })
    for (const body of published) {
      await publisher.publish(createAmqpMessage({ body }))
    }

    await eventually(() => {
      expect(receivedByHighPriority).toEqual(published.slice(0, 5))
      expect(receivedByLowPriority).toEqual(published.slice(5))
    })
  })
})
