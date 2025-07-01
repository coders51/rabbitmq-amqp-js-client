import {
  generate_uuid,
  Receiver,
  ReceiverEvents,
  ReceiverOptions,
  Connection,
  SenderOptions,
  EventContext,
  Message,
} from "rhea"
import { openLink } from "./utils.js"
import { createAddressFrom } from "./message.js"

export type ConsumerMessageHandler = (message: Message) => void

export type CreateConsumerParams = {
  messageHandler: ConsumerMessageHandler
}

const getConsumerReceiverLinkConfigurationFrom = (
  address: string,
  consumerId: string
): SenderOptions | ReceiverOptions => ({
  snd_settle_mode: 0,
  rcv_settle_mode: 0,
  name: consumerId,
  target: { address, expiry_policy: "SESSION_END", durable: 0, dynamic: false },
  source: {
    address,
    expiry_policy: "LINK_DETACH",
    timeout: 0,
    dynamic: false,
    durable: 0,
  },
})

export interface Consumer {
  start(): void
  close(): void
  get id(): string
}

export class AmqpConsumer implements Consumer {
  static async createFrom(
    connection: Connection,
    consumersList: Map<string, Consumer>,
    queueName: string,
    params: CreateConsumerParams
  ) {
    const id = generate_uuid()
    const address = createAddressFrom({ queue: { name: queueName } })
    if (!address) throw new Error("Consumer must have an address")

    const receiverLink = await AmqpConsumer.openReceiver(connection, address, id)
    return new AmqpConsumer(id, connection, consumersList, receiverLink, params)
  }

  private static async openReceiver(connection: Connection, address: string, consumerId: string): Promise<Receiver> {
    return openLink<Receiver>(
      connection,
      ReceiverEvents.receiverOpen,
      ReceiverEvents.receiverError,
      connection.open_receiver.bind(connection),
      getConsumerReceiverLinkConfigurationFrom(address, consumerId)
    )
  }

  constructor(
    private readonly _id: string,
    private readonly connection: Connection,
    private readonly consumersList: Map<string, Consumer>,
    private readonly receiverLink: Receiver,
    private readonly params: CreateConsumerParams
  ) {
    console.log(this.connection.container_id)
  }

  get id() {
    return this._id
  }

  start() {
    this.receiverLink.on(ReceiverEvents.message, (context: EventContext) => {
      console.log("message received", context.message?.body)
      if (context.message && context.delivery) {
        console.log("message accepted")
        try {
          this.params.messageHandler(context.message)
          context.delivery.accept()
          console.log("message consumed")
        } catch (e) {
          context.delivery.reject({ condition: "Message Handler error", info: e })
          console.log("message rejected")
        }
      }
    })
  }

  close() {
    this.receiverLink.removeAllListeners()
    if (this.receiverLink.is_open()) this.receiverLink.close()
    if (this.consumersList.has(this._id)) this.consumersList.delete(this._id)
  }
}
