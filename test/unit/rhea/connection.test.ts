import { afterEach, beforeEach, describe, test } from "vitest"
import { use, expect } from "chai"
import chaiAsPromised from "chai-as-promised"
import { host, port, username, password, numberOfConnections, eventually, wait } from "../../support/util.js"
import { Connection, ConnectionOptions, Container, create_container } from "rhea"

use(chaiAsPromised)

describe("Rhea tests", () => {
  let container: Container

  beforeEach(async () => {
    container = create_container()
  })

  afterEach(async () => {})

  test("create a connection", async () => {
    await open(container, {
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
    const connection = await open(container, {
      host,
      port,
      username,
      password,
    })
    await wait(4000)

    await eventually(async () => {
      await openSender(connection)
      await openReceiver(connection)
    }, 4000)
  })
})

async function open(container: Container, params: ConnectionOptions): Promise<Connection> {
  return new Promise((res, rej) => {
    container.once("connection_open", (context) => {
      return res(context.connection)
    })
    container.once("error", (context) => {
      return rej(context.connection.error)
    })
    container.connect(params)
  })
}

async function openReceiver(connection: Connection) {
  return new Promise((res, rej) => {
    connection.once("receiver_open", (context) => {
      return res(context.receiver)
    })
    connection.once("receiver_error", (context) => {
      return rej(context.connection.error)
    })
    connection.open_receiver({
      snd_settle_mode: 1,
      rcv_settle_mode: 0,
      name: "management-link-pair",
      target: { address: "/management", expiry_policy: "LINK_DETACH", timeout: 0, dynamic: false },
      source: { address: "/management", expiry_policy: "LINK_DETACH", timeout: 0, dynamic: false, durable: 0 },
      properties: { paired: true },
    })
  })
}

async function openSender(connection: Connection) {
  return new Promise((res, rej) => {
    connection.once("sender_open", (context) => {
      return res(context.sender)
    })
    connection.once("sender_error", (context) => {
      return rej(context.connection.error)
    })
    connection.open_sender({
      snd_settle_mode: 1,
      rcv_settle_mode: 0,
      name: "management-link-pair",
      target: { address: "/management", expiry_policy: "LINK_DETACH", timeout: 0, dynamic: false },
      source: { address: "/management", expiry_policy: "LINK_DETACH", timeout: 0, dynamic: false, durable: 0 },
      properties: { paired: true },
    })
  })
}
