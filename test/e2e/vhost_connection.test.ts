import { afterAll, afterEach, beforeAll, describe, expect, test } from "vitest"
import { createEnvironment, Environment } from "../../src/environment.js"
import { createAmqpMessage } from "../../src/message.js"
import {
  createVhost,
  deleteVhost,
  eventually,
  existsQueueInVhost,
  host,
  password,
  port,
  username,
} from "../support/util.js"

describe("Connecting to a virtual host", () => {
  const vhostName = "test-vhost"
  const queueName = "test-vhost-queue"
  let environment: Environment

  beforeAll(async () => {
    await createVhost(vhostName)
  })

  afterAll(async () => {
    await deleteVhost(vhostName)
  })

  afterEach(async () => {
    if (environment) await environment.close()
  })

  test("declare a queue, publish and consume on a non-default virtual host", async () => {
    environment = createEnvironment({
      host,
      port,
      username,
      password,
      virtualHost: vhostName,
    })
    const connection = await environment.createConnection()
    const management = connection.management()
    await management.declareQueue(queueName)
    const publisher = await connection.createPublisher({ queue: { name: queueName } })
    let received: string = ""
    const consumer = await connection.createConsumer({
      queue: { name: queueName },
      messageHandler: (context, message) => {
        context.accept()
        received = message.body
      },
    })
    consumer.start()

    await publisher.publish(createAmqpMessage({ body: "hello-vhost" }))

    await eventually(async () => {
      expect(received).toEqual("hello-vhost")
    })
    expect(await existsQueueInVhost(queueName, vhostName)).toBe(true)
    expect(await existsQueueInVhost(queueName, "/")).toBe(false)
  })

  test("connecting to a non-existent virtual host fails", async () => {
    environment = createEnvironment({
      host,
      port,
      username,
      password,
      virtualHost: "this-vhost-does-not-exist",
    })

    const connecting = environment.createConnection({ reconnect: false })

    await expect(connecting).rejects.toThrow()
  })
})
