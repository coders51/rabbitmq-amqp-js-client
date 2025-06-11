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
