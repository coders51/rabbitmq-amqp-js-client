import {
  Connection,
  ConnectionEvents,
  ConnectionOptions,
  Container,
  Receiver,
  ReceiverEvents,
  ReceiverOptions,
  Sender,
  SenderEvents,
  SenderOptions,
} from "rhea"

export const testExchangeName = "test-exchange"
export const testQueueName = "test-queue"

export async function openConnection(container: Container, params: ConnectionOptions): Promise<Connection> {
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

export async function closeConnection(connection: Connection): Promise<void> {
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

const getPublisherNodeConfigurationFrom = (address?: string): SenderOptions => ({
  snd_settle_mode: 0,
  rcv_settle_mode: 0,
  name: "publisher-sender-link",
  target: { address, expiry_policy: "SESSION_END", durable: 0, dynamic: false },
  source: {
    address: address ?? "",
    expiry_policy: "LINK_DETACH",
    timeout: 0,
    dynamic: false,
    durable: 0,
  },
})

type LinkOpenEvents = SenderEvents.senderOpen | ReceiverEvents.receiverOpen
type LinkErrorEvents = SenderEvents.senderError | ReceiverEvents.receiverError
type OpenLinkMethods =
  | ((options?: SenderOptions | string) => Sender)
  | ((options?: ReceiverOptions | string) => Receiver)
export type RheaManagement = {
  receiver: Receiver
  sender: Sender
}

export async function openManagement(connection: Connection): Promise<RheaManagement> {
  const receiver = await openReceiver(connection)
  const sender = await openSender(connection)

  return { receiver, sender }
}

async function openReceiver(connection: Connection) {
  return openLink<Receiver>(
    connection,
    ReceiverEvents.receiverOpen,
    ReceiverEvents.receiverError,
    connection.open_receiver.bind(connection),
    MANAGEMENT_NODE_CONFIGURATION
  )
}

async function openSender(connection: Connection) {
  return openLink<Sender>(
    connection,
    SenderEvents.senderOpen,
    SenderEvents.senderError,
    connection.open_sender.bind(connection),
    MANAGEMENT_NODE_CONFIGURATION
  )
}

async function openLink<T extends Sender | Receiver>(
  connection: Connection,
  successEvent: LinkOpenEvents,
  errorEvent: LinkErrorEvents,
  openMethod: OpenLinkMethods,
  config?: SenderOptions | ReceiverOptions | string
): Promise<T> {
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

export async function openPublisherSender(connection: Connection, address?: string) {
  return openLink<Sender>(
    connection,
    SenderEvents.senderOpen,
    SenderEvents.senderError,
    connection.open_sender.bind(connection),
    getPublisherNodeConfigurationFrom(address)
  )
}

export async function sendCreationExchangeMessage(connection: Connection, sender: Sender, receiver: Receiver) {
  console.log("hello")

  return new Promise((res, rej) => {
    connection.once(SenderEvents.sendable, function () {
      console.log("sent ")
      return res(true)
    })
    connection.once(SenderEvents.accepted, function () {
      console.log("all messages confirmed")
      return res(true)
    })
    receiver.once("message", function (context) {
      console.log("inside receiver message", context.message)
      return res(true)
    })
    connection.once(SenderEvents.rejected, function (context) {
      console.log("Rejected")
      return rej(context.sender.error)
    })
    connection.once(SenderEvents.released, function (context) {
      console.log("Released")
      return rej(context.sender.error)
    })
    connection.once(SenderEvents.modified, function (context) {
      console.log("Modified")
      return rej(context.sender.error)
    })
    connection.once(SenderEvents.senderError, function (context) {
      console.log("SenderError")
      return rej(context.sender.error)
    })
    connection.once(SenderEvents.settled, function (context) {
      console.log("Settled")
      return rej(context.sender.error)
    })

    sender.send({
      message_id: 0,
      to: `/exchanges/${encodeURIComponent(testExchangeName)}`,
      reply_to: "$me",
      subject: "PUT",
      body: { durable: true, type: "direct", auto_delete: true, arguments: {} },
    })
  })
}

export async function sendCreationQueueMessage(connection: Connection, sender: Sender, receiver: Receiver) {
  console.log("hello")

  return new Promise((res, rej) => {
    connection.once(SenderEvents.sendable, function () {
      console.log("sent ")
      return res(true)
    })
    connection.once(SenderEvents.accepted, function () {
      console.log("all messages confirmed")
      return res(true)
    })
    receiver.once("message", function (context) {
      console.log("inside receiver message", context.message)
      return res(true)
    })
    connection.once(SenderEvents.rejected, function (context) {
      console.log("Rejected")
      return rej(context.sender.error)
    })
    connection.once(SenderEvents.released, function (context) {
      console.log("Released")
      return rej(context.sender.error)
    })
    connection.once(SenderEvents.modified, function (context) {
      console.log("Modified")
      return rej(context.sender.error)
    })
    connection.once(SenderEvents.senderError, function (context) {
      console.log("SenderError")
      return rej(context.sender.error)
    })
    connection.once(SenderEvents.settled, function (context) {
      console.log("Settled")
      return rej(context.sender.error)
    })

    sender.send({
      message_id: 0,
      to: `/queues/${encodeURIComponent(testQueueName)}`,
      reply_to: "$me",
      subject: "PUT",
      body: { durable: true, exclusive: true, auto_delete: true, arguments: {} },
    })
  })
}
