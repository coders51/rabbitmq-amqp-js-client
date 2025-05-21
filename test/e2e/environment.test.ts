import { afterEach, beforeEach, describe, test } from "vitest"
import { use, expect } from "chai"
import chaiAsPromised from "chai-as-promised"
import { AmqpEnvironment, Environment } from "../../src/environment"
import { existsConnection } from "../support/util"

use(chaiAsPromised)

describe("Environment", () => {
  let environment: Environment

  beforeEach(async () => {
    environment = await AmqpEnvironment.create({
      host: "localhost",
      port: 5672,
      username: "guest",
      password: "guest",
    })
  })

  afterEach(async () => {
    await environment.close()
  })

  test("create a connection through the environment", async () => {
    const connection = await environment.createConnection()

    expect(await existsConnection(connection.name)).to.eql(true)
  })
})
