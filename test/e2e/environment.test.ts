import { afterEach, beforeEach, describe, expect, test } from "vitest"
import { createEnvironment, Environment } from "../../src/environment.js"
import { host, port, username, password, numberOfConnections, eventually } from "../support/util.js"

describe("Environment", () => {
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

  test("create a connection through the environment", async () => {
    await environment.createConnection()

    await eventually(async () => {
      expect(await numberOfConnections()).to.eql(1)
    })
  })
})
