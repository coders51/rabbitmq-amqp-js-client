import { describe, expect, test } from "vitest"
import { createEnvironment, Environment } from "../../src/environment.js"
import {
  host,
  port,
  username,
  generateToken,
  eventually,
  numberOfConnections,
  wait,
  closeAllConnections,
  password,
} from "../support/util.js"
import { Connection } from "../../src/connection.js"

describe("Oauth2 Connection", () => {
  let environment: Environment
  let connection: Connection

  test("creating an oauth2 connection", async () => {
    const token = generateToken(username, 10)
    environment = createEnvironment({ host, port, username, password, oauth: { token } })

    connection = await environment.createConnection()

    await eventually(async () => {
      expect(await numberOfConnections()).to.eql(1)
    })
    await connection.close()
    await environment.close()
  })

  test("refreshing the token of an oauth2 connection", async () => {
    const token = generateToken(username, 10)
    environment = createEnvironment({ host, port, username, password, oauth: { token } })

    connection = await environment.createConnection()
    await wait(3000)
    await connection.refreshToken(generateToken(username, 10))

    await eventually(async () => {
      expect(await numberOfConnections()).to.eql(1)
    })
    await connection.close()
    await environment.close()
  }, 10000)

  test("reconnect with new token of an oauth2 connection", async () => {
    const token = generateToken(username, 100)
    environment = createEnvironment({ host, port, username, password, oauth: { token } })
    connection = await environment.createConnection()
    await connection.refreshToken(generateToken(username, 100))

    await closeAllConnections()

    await eventually(async () => {
      expect(await numberOfConnections()).to.eql(1)
    })
    await connection.close()
    await environment.close()
  }, 15000)
})
