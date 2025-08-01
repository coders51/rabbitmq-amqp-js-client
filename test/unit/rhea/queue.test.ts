import { afterAll, beforeAll, describe, test } from "vitest"
import { host, port, username, password } from "../../support/util.js"
import { Connection, Container, create_container } from "rhea"
import {
  closeConnection,
  openConnection,
  openManagement,
  RheaManagement,
  sendCreationQueueMessage,
} from "../../support/rhea_utils.js"

describe("Rhea queues", () => {
  let container: Container
  let connection: Connection
  let management: RheaManagement

  beforeAll(async () => {
    container = create_container()
    connection = await openConnection(container, {
      host,
      port,
      username,
      password,
    })
    management = await openManagement(connection)
  })

  afterAll(async () => {
    await closeConnection(connection)
  })

  test("create a queue", async () => {
    await sendCreationQueueMessage(connection, management.sender, management.receiver)

    console.log("All ok")
  })
})
