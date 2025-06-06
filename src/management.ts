import { AmqpQueueInfo, QueueInfo } from "./queue.js"
import {
  generate_uuid,
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
  auto_delete: boolean
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
  declareQueue: (queueName: string, options: Partial<QueueOptions>) => QueueInfo
  close: () => void
}

export class AmqpManagement implements Management {
  static async create(connection: RheaConnection): Promise<AmqpManagement> {
    const senderLink = await AmqpManagement.openSender(connection)
    const receiverLink = await AmqpManagement.openReceiver(connection)
    return new AmqpManagement(senderLink, receiverLink)
  }

  constructor(
    // private readonly connection: RheaConnection,
    private senderLink: Sender,
    private receiverLink: Receiver
  ) {
    console.log(this.receiverLink.is_open())
  }

  async close() {}

  private static async openReceiver(connection: RheaConnection): Promise<Receiver> {
    return AmqpManagement.openLink<Receiver>(
      connection,
      ReceiverEvents.receiverOpen,
      ReceiverEvents.receiverError,
      connection.open_receiver.bind(connection),
      MANAGEMENT_NODE_CONFIGURATION
    )
  }

  private static async openSender(connection: RheaConnection): Promise<Sender> {
    return AmqpManagement.openLink<Sender>(
      connection,
      SenderEvents.senderOpen,
      SenderEvents.senderError,
      connection.open_sender.bind(connection),
      MANAGEMENT_NODE_CONFIGURATION
    )
  }

  private static async openLink<T extends Sender | Receiver>(
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

  declareQueue(queueName: string, options: Partial<QueueOptions> = {}): QueueInfo {
    // decode the response
    // create queueInfo

    this.senderLink.send({
      message_id: generate_uuid(),
      to: `/queues/${encodeURIComponent(queueName)}`,
      reply_to: "$me",
      subject: "PUT",
      body: options,
    })

    return new AmqpQueueInfo({ name: queueName })
  }
}
