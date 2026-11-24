import { afterEach, beforeEach, describe, expect, test } from "vitest"
import { brokerVersionAtLeast, cleanRabbit, eventually, host, password, port, username } from "../support/util.js"
import { createEnvironment, Environment } from "../../src/environment.js"
import { Connection } from "../../src/connection.js"
import { createAmqpMessage } from "../../src/message.js"
import { Offset } from "../../src/utils.js"

describe.skipIf(!(await brokerVersionAtLeast(4, 4)))("Stream initial offset (RabbitMQ 4.4+)", () => {
  let environment: Environment
  let connection: Connection
  const streamName = "test-stream-initial-offset"
  const initialOffset = 1000n

  beforeEach(async () => {
    environment = createEnvironment({ host, port, username, password })
    connection = await environment.createConnection()
    await connection.management().declareQueue(streamName, { type: "stream", initialOffset })
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

  async function publish(count: number) {
    const publisher = await connection.createPublisher({ queue: { name: streamName } })
    for (let i = 0; i < count; i++) {
      await publisher.publish(createAmqpMessage({ body: `message-${i}` }))
    }
    await publisher.close()
  }

  async function consumeOffsetsFrom(offset: Offset): Promise<number[]> {
    const offsets: number[] = []
    const consumer = await connection.createConsumer({
      stream: { name: streamName, offset },
      messageHandler: (context, message) => {
        offsets.push(Number(message.message_annotations?.["x-stream-offset"]))
        context.accept()
      },
    })
    consumer.start()
    return offsets
  }

  test("the first message of the stream gets the initial offset", async () => {
    await publish(3)

    const offsets = await consumeOffsetsFrom(Offset.first())

    await eventually(() => expect(offsets).toEqual([1000, 1001, 1002]))
  }, 15000)

  test("a consumer with a numeric offset counts from the initial offset", async () => {
    await publish(3)

    const offsets = await consumeOffsetsFrom(Offset.offset(1001n))

    await eventually(() => expect(offsets).toEqual([1001, 1002]))
  }, 15000)

  test("a consumer with next on an empty stream starts from the initial offset", async () => {
    const offsets = await consumeOffsetsFrom(Offset.next())

    await publish(1)

    await eventually(() => expect(offsets).toEqual([1000]))
  }, 15000)

  test("redeclaring the stream with a different initial offset is rejected", async () => {
    await expect(
      connection.management().declareQueue(streamName, { type: "stream", initialOffset: 2000n })
    ).rejects.toThrowError()
  })
})
