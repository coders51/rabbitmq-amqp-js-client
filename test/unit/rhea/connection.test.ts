import { afterEach, beforeEach, describe, expect, test } from "vitest"
import { host, port, username, password, numberOfConnections, eventually } from "../../support/util.js"
import { Connection, Container, create_container } from "rhea"
import { closeConnection, openConnection, openManagement } from "../../support/rhea_utils.js"

describe("Rhea connections", () => {
  let container: Container
  let connection: Connection

  beforeEach(async () => {
    container = create_container()
  })

  afterEach(async () => {
    await closeConnection(connection)
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
})
