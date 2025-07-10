import { afterEach, beforeEach, describe, expect, test } from "vitest"
import { host, port, username, password, numberOfConnections, eventually } from "../../support/util.js"
import { Connection, Container, create_container } from "rhea"
import { closeConnection, openConnection, openManagement } from "../../support/rhea_utils.js"
import { isReconnectionParamsDetails } from "../../../src/connection.js"

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

  test("is reconnection param detail", () => {
    expect(isReconnectionParamsDetails(true)).to.eql(false)
    expect(isReconnectionParamsDetails(false)).to.eql(false)
    expect(isReconnectionParamsDetails(123)).to.eql(false)
    expect(
      isReconnectionParamsDetails({
        initialReconnectDelay: 1,
        maxReconnectDelay: 1,
        reconnectLimit: 1,
      })
    ).to.eql(true)
  })
})
