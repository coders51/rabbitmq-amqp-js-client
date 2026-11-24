import { afterEach, beforeEach, describe, expect, test } from "vitest"
import { cleanRabbit, eventually, host, password, port, username, wait } from "../support/util.js"
import { createEnvironment, Environment } from "../../src/environment.js"
import { Connection } from "../../src/connection.js"
import { createAmqpMessage } from "../../src/message.js"
import { Offset } from "../../src/utils.js"

describe("Stream consumer offset", () => {
  let environment: Environment
  let connection: Connection
  const streamName = "test-stream-offset"

  beforeEach(async () => {
    environment = createEnvironment({ host, port, username, password })
    connection = await environment.createConnection()
    await connection.management().declareQueue(streamName, { type: "stream" })
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

  async function publish(bodies: string[]) {
    const publisher = await connection.createPublisher({ queue: { name: streamName } })
    for (const body of bodies) {
      await publisher.publish(createAmqpMessage({ body }))
    }
    await publisher.close()
  }

  async function consumeFrom(offset: Offset): Promise<string[]> {
    const received: string[] = []
    const consumer = await connection.createConsumer({
      stream: { name: streamName, offset },
      messageHandler: (context, message) => {
        received.push(message.body)
        context.accept()
      },
    })
    consumer.start()
    return received
  }

  const messages = (prefix: string, count: number) => Array.from({ length: count }, (_, i) => `${prefix}-${i}`)

  test("a consumer with offset 0 reads the stream from the first message", async () => {
    await publish(messages("message", 10))

    const received = await consumeFrom(Offset.offset(0n))

    await eventually(() => expect(received).toEqual(messages("message", 10)))
  }, 15000)

  test("a consumer with a numeric offset reads the stream from that offset", async () => {
    await publish(messages("message", 10))

    const received = await consumeFrom(Offset.offset(5n))

    await eventually(() => expect(received).toEqual(messages("message", 10).slice(5)))
  }, 15000)

  test("a consumer with a timestamp offset skips the messages published before it", async () => {
    await publish(messages("before", 5))
    await wait(1500)
    const timestamp = new Date()
    await wait(500)
    await publish(messages("after", 5))

    const received = await consumeFrom(Offset.timestamp(timestamp))

    await eventually(() => expect(received).toEqual(messages("after", 5)))
  }, 15000)
})
