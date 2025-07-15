import { afterEach, beforeEach, describe, expect, test } from "vitest"
import { host, port, username, password, numberOfConnections, eventually } from "../../support/util.js"
import { Connection, Container, create_container, websocket_connect } from "rhea"
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

  test("create a connection through a websocket", async () => {
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
