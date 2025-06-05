import { Management } from "../../src/index.js"
import { afterEach, beforeEach, describe, expect, test } from "vitest"
import { eventually, existsQueue, host, password, port, username } from "../support/util.js"
import { createEnvironment, Environment } from "../../src/environment.js"
import { Connection } from "../../src/connection.js"

describe("Management", () => {
  let environment: Environment
  let connection: Connection
  let management: Management

  beforeEach(async () => {
    environment = createEnvironment({
      host,
      port,
      username,
      password,
    })
    connection = await environment.createConnection()
    management = await connection.management()
  })

  afterEach(async () => {
    await management.close()
    await connection.close()
    await environment.close()
  })

  test("create a queue through the management", async () => {
    const queueInfo = await management.declareQueue("test-queue", { exclusive: true, autoDelete: false })

    expect(queueInfo.name).to.eql("test-queue")
    await eventually(async () => {
      expect(await existsQueue(queueInfo.name)).to.eql("test-queue")
    })
  })
})
