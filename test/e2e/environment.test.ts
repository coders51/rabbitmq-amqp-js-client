import { afterEach, beforeEach, describe, test } from "vitest"
import { use, expect } from "chai"
import chaiAsPromised from "chai-as-promised"
import { AmqpEnvironment, Environment } from "../../src/environment.js"
import { host, port, username, password, numberOfConnections } from "../support/util.js"

use(chaiAsPromised)

describe("Environment", () => {
  let environment: Environment

  beforeEach(async () => {
    environment = await AmqpEnvironment.create({
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

    expect(await numberOfConnections()).to.eql(1)
  })
})
