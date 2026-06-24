import { describe, test, beforeEach, afterEach, expect } from "vitest"
import { createEnvironment, Environment } from "../../src/environment.js"
import { Connection } from "../../src/connection.js"
import { eventually, host, password, port, username, cleanRabbit } from "../support/util.js"
import { Message } from "rhea"

describe("Direct Reply-To", () => {
  let environment: Environment
  let connection: Connection
  const requestQueueName = "test-direct-reply-to-request"

  beforeEach(async () => {
    environment = createEnvironment({ host, port, username, password })
    connection = await environment.createConnection()
    await connection.management().declareQueue(requestQueueName)
  })

  afterEach(async () => {
    try {
      await cleanRabbit({ match: /test-direct-reply-to/ })
      await connection.close()
      await environment.close()
    } catch (error) {
      console.error(error)
    }
  })

  test("direct reply-to consumer gets a replyTo address from the broker", async () => {
    const consumer = await connection.createConsumer({
      directReplyTo: true,
      messageHandler: () => {},
    })

    consumer.start()

    expect(consumer.replyTo).toContain("amq.rabbitmq.reply-to")
  })

  test("direct reply-to enables ping-pong without a reply queue", async () => {
    let receivedReply: Message | undefined

    const requesterConsumer = await connection.createConsumer({
      directReplyTo: true,
      messageHandler: (_ctx, message) => {
        receivedReply = message
      },
    })
    requesterConsumer.start()

    const responderPublisher = await connection.createPublisher()
    const responderConsumer = await connection.createConsumer({
      queue: { name: requestQueueName },
      messageHandler: (ctx, message) => {
        ctx.accept()
        if (message.reply_to) {
          responderPublisher.publish({ body: "pong", to: message.reply_to })
        }
      },
    })
    responderConsumer.start()

    const requesterPublisher = await connection.createPublisher({ queue: { name: requestQueueName } })

    await requesterPublisher.publish({ body: "ping", reply_to: requesterConsumer.replyTo })

    await eventually(() => {
      expect(receivedReply).toBeDefined()
      expect(receivedReply!.body).toBe("pong")
    })
  })
})
