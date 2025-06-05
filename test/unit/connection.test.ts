import { afterEach, beforeEach, describe, expect, test } from "vitest"
import { createEnvironment, Environment } from "../../src/environment.js"
import { host, port, username, password, numberOfConnections, eventually } from "../support/util.js"

describe("Connection", () => {
  let environment: Environment

  beforeEach(async () => {
    environment = createEnvironment({
      host,
      port,
      username,
      password,
    })
  })

  afterEach(async () => {
    await environment.close()
  })

  test("closing the connection", async () => {
    const connection = await environment.createConnection()

    await connection.close()

    await eventually(async () => {
      expect(await numberOfConnections()).to.eql(0)
    })
  })
})
