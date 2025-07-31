import { afterEach, beforeEach, describe, expect, test } from "vitest"
import { host, port, username, password, numberOfConnections, eventually, generateToken } from "../../support/util.js"
import { Connection, Container, create_container } from "rhea"
import { closeConnection, openConnection, openManagement, openWebSocketConnection } from "../../support/rhea_utils.js"

describe("Rhea connections", () => {
  let container: Container
  let connection: Connection

  beforeEach(async () => {
    container = create_container()
  })

  afterEach(async () => {
    if (connection) await closeConnection(connection)
  })

  test("create a connection", async () => {
    connection = await openConnection(container, {
      host,
      port,
      username,
      password,
    })

    await eventually(async () => {
      expect(await numberOfConnections()).to.eql(1)
    })
  })

  test("create a connection using oauth2", async () => {
    const token = generateToken(username, 60)

    connection = await openConnection(container, {
      host,
      port,
      username,
      password: token,
    })

    await eventually(async () => {
      expect(await numberOfConnections()).to.eql(1)
    })
  })

  test.skip("create a connection through a websocket", async () => {
    connection = await openWebSocketConnection(container, `ws://${username}:${password}@${host}:${port}`)

    await eventually(async () => {
      expect(await numberOfConnections()).to.eql(1)
    })
  })

  test("connect to the management", async () => {
    connection = await openConnection(container, {
      host,
      port,
      username,
      password,
    })

    await eventually(async () => {
      await openManagement(connection)
    }, 4000)
  })
})
