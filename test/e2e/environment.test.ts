import { afterEach, beforeEach, describe, expect, test } from "vitest"
import { createEnvironment, Environment } from "../../src/environment.js"
import {
  host,
  port,
  username,
  password,
  numberOfConnections,
  eventually,
  closeAllConnections,
  wait,
} from "../support/util.js"

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

  test("a connection with reconnect false does not reconnect", async () => {
    await environment.createConnection({ reconnect: false })

    await closeAllConnections()
    await wait(2000)

    expect(await numberOfConnections()).to.eql(0)
  })

  test("a connection with reconnect true reconnects", async () => {
    await environment.createConnection({ reconnect: true })

    await closeAllConnections()

    await eventually(async () => {
      expect(await numberOfConnections()).to.eql(1)
    })
  })

  test("a connection reconnects by default", async () => {
    await environment.createConnection()

    await closeAllConnections()

    await eventually(async () => {
      expect(await numberOfConnections()).to.eql(1)
    })
  })

  test("a connection with reconnect set to number retries after number ms", async () => {
    await environment.createConnection({ reconnect: 2000, initialReconnectDelay: 2000 })

    await closeAllConnections()
    await wait(1900)

    expect(await numberOfConnections()).to.eql(0)
    await eventually(async () => {
      expect(await numberOfConnections()).to.eql(1)
    })
  })
})
