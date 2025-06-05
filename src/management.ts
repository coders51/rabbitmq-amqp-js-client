import { AmqpQueueInfo, QueueInfo } from "./queue.js"
import {
  Receiver,
  ReceiverEvents,
  ReceiverOptions,
  Connection as RheaConnection,
  Sender,
  SenderEvents,
  SenderOptions,
} from "rhea"

type QueueOptions = {
  exclusive: boolean
  autoDelete: boolean
}

type LinkOpenEvents = SenderEvents.senderOpen | ReceiverEvents.receiverOpen
type LinkErrorEvents = SenderEvents.senderError | ReceiverEvents.receiverError
type OpenLinkMethods =
  | ((options?: SenderOptions | string) => Sender)
  | ((options?: ReceiverOptions | string) => Receiver)

const MANAGEMENT_NODE_CONFIGURATION: SenderOptions | ReceiverOptions = {
  snd_settle_mode: 1,
  rcv_settle_mode: 0,
  name: "management-link-pair",
  target: { address: "/management", expiry_policy: "LINK_DETACH", timeout: 0, dynamic: false },
  source: { address: "/management", expiry_policy: "LINK_DETACH", timeout: 0, dynamic: false, durable: 0 },
  properties: { paired: true },
}

export interface Management {
  declareQueue: (queueName: string, options: Partial<QueueOptions>) => Promise<QueueInfo>
  close: () => void
  open: () => Promise<void>
}

export class AmqpManagement implements Management {
  private readonly rheaConnection: RheaConnection
  private senderLink: Sender | null = null
  private receiverLink: Receiver | null = null

  constructor(connection: RheaConnection) {
    this.rheaConnection = connection
  }

  async close() {}

  async open(): Promise<void> {
    this.senderLink = await this.openSender(this.rheaConnection)
    this.receiverLink = await this.openReceiver(this.rheaConnection)
  }

  private async openReceiver(connection: RheaConnection): Promise<Receiver> {
    return this.openLink<Receiver>(
      connection,
      ReceiverEvents.receiverOpen,
      ReceiverEvents.receiverError,
      connection.open_receiver.bind(connection),
      MANAGEMENT_NODE_CONFIGURATION
    )
  }

  private async openSender(connection: RheaConnection): Promise<Sender> {
    return this.openLink<Sender>(
      connection,
      SenderEvents.senderOpen,
      SenderEvents.senderError,
      connection.open_sender.bind(connection),
      MANAGEMENT_NODE_CONFIGURATION
    )
  }

  private async openLink<T extends Sender | Receiver>(
    connection: RheaConnection,
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

  async declareQueue(queueName: string, options: Partial<QueueOptions> = {}): Promise<QueueInfo> {
    // mandi i messaggi per la creazione della coda
    // decodifichi la risposta
    // crei la queueInfo in base alla risposta

    return new AmqpQueueInfo({ name: queueName })
  }
}
