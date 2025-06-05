import { afterEach, beforeEach, describe, test } from "vitest"
import { use, expect } from "chai"
import chaiAsPromised from "chai-as-promised"
import { host, port, username, password, numberOfConnections, eventually } from "../../support/util.js"
import {
  Connection,
  ConnectionEvents,
  ConnectionOptions,
  Container,
  create_container,
  Receiver,
  ReceiverEvents,
  ReceiverOptions,
  Sender,
  SenderEvents,
  SenderOptions,
} from "rhea"

use(chaiAsPromised)

describe("Rhea tests", () => {
  let container: Container
  let connection: Connection

  beforeEach(async () => {
    container = create_container()
  })

  afterEach(async () => {
    await close(connection)
  })

  test("create a connection", async () => {
    connection = await open(container, {
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
    connection = await open(container, {
      host,
      port,
      username,
      password,
    })

    await eventually(async () => {
      await openSender(connection)
      await openReceiver(connection)
    }, 4000)
  })
})

async function open(container: Container, params: ConnectionOptions): Promise<Connection> {
  return new Promise((res, rej) => {
    container.once(ConnectionEvents.connectionOpen, (context) => {
      return res(context.connection)
    })
    container.once(ConnectionEvents.error, (context) => {
      return rej(context.connection.error)
    })
    container.connect(params)
  })
}

async function close(connection: Connection): Promise<void> {
  return new Promise((res, rej) => {
    connection.once(ConnectionEvents.connectionClose, () => {
      res()
    })
    connection.once(ConnectionEvents.connectionError, (context) => {
      rej(new Error("Connection error: " + context.connection.error))
    })
    connection.close()
  })
}

const MANAGEMENT_NODE_CONFIGURATION: SenderOptions | ReceiverOptions = {
  snd_settle_mode: 1,
  rcv_settle_mode: 0,
  name: "management-link-pair",
  target: { address: "/management", expiry_policy: "LINK_DETACH", timeout: 0, dynamic: false },
  source: { address: "/management", expiry_policy: "LINK_DETACH", timeout: 0, dynamic: false, durable: 0 },
  properties: { paired: true },
}

async function openReceiver(connection: Connection) {
  return openLink(
    connection,
    ReceiverEvents.receiverOpen,
    ReceiverEvents.receiverError,
    connection.open_receiver.bind(connection),
    MANAGEMENT_NODE_CONFIGURATION
  )
}

async function openSender(connection: Connection) {
  return openLink(
    connection,
    SenderEvents.senderOpen,
    SenderEvents.senderError,
    connection.open_sender.bind(connection),
    MANAGEMENT_NODE_CONFIGURATION
  )
}

type LinkOpenEvents = SenderEvents.senderOpen | ReceiverEvents.receiverOpen
type LinkErrorEvents = SenderEvents.senderError | ReceiverEvents.receiverError
type OpenLinkMethods =
  | ((options?: SenderOptions | string) => Sender)
  | ((options?: ReceiverOptions | string) => Receiver)

async function openLink(
  connection: Connection,
  successEvent: LinkOpenEvents,
  errorEvent: LinkErrorEvents,
  openMethod: OpenLinkMethods,
  config?: SenderOptions | ReceiverOptions | string
): Promise<Sender | Receiver> {
  return new Promise((res, rej) => {
    connection.once(successEvent, (context) => {
      return res(context.receiver || context.sender)
    })
    connection.once(errorEvent, (context) => {
      return rej(context.connection.error)
    })
    openMethod(config)
  })
}
