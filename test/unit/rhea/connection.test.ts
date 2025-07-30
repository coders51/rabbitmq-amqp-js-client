import { afterEach, beforeEach, describe, expect, test } from "vitest"
import {
  host,
  port,
  username,
  password,
  numberOfConnections,
  eventually,
  Token,
  generateToken,
} from "../../support/util.js"
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

  test("create an oauth2 connection", async () => {
    const token = generateToken(60)
    container = create_container()
    // container.sasl.client_mechanisms().enable_xoauth2(username, "abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGH")
    console.log(container.sasl.Client.mechanism)
    connection = await openConnection(container, {
      host,
      port,
      username: "guest",
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
