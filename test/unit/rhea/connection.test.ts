import { afterEach, beforeEach, describe, test } from "vitest"
import { use, expect } from "chai"
import chaiAsPromised from "chai-as-promised"
import { host, port, username, password, wait, numberOfConnections } from "../../support/util.js"
import { Connection, ConnectionOptions, Container, create_container } from "rhea"

use(chaiAsPromised)

describe.only("Create a connection through rhea", () => {
  let container: Container

  beforeEach(async () => {
    container = create_container()
  })

  afterEach(async () => {})

  test("create a connection through the environment", async () => {
    await open(container, {
      host,
      port,
      username,
      password,
    })
    await wait(5000)

    expect(await numberOfConnections()).to.eql(1)
  })
})

async function open(container: Container, params: ConnectionOptions): Promise<Connection> {
  return new Promise((res, rej) => {
    container.once("connection_open", (context) => {
      return res(context.connection)
    })
    container.once("error", (context) => {
      console.log(context)
      rej()
    })
    container.connect(params)
  })
}
