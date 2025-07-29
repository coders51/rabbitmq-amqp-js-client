import { Connection, Delivery, EventContext, Message, ReceiverOptions, Sender, SenderEvents, SenderOptions } from "rhea"
import { openLink, OutcomeState } from "./utils.js"
import { v4 as uuid } from "uuid"
import { inspect } from "util"
import { createPublisherAddressFrom, DestinationOptions } from "./message.js"

const getPublisherSenderLinkConfigurationFrom = (
  publisherId: string,
  address?: string
): SenderOptions | ReceiverOptions => ({
  snd_settle_mode: 0,
  rcv_settle_mode: 0,
  name: publisherId,
  target: { address, expiry_policy: "SESSION_END", durable: 0, dynamic: false },
  source: {
    address: address ?? "",
    expiry_policy: "LINK_DETACH",
    timeout: 0,
    dynamic: false,
    durable: 0,
  },
})

interface PublishResult {
  delivery: Delivery
  outcome: OutcomeState
}

type ResolvableSenderEvents = SenderEvents.accepted | SenderEvents.rejected | SenderEvents.released
type RejectableSenderEvents = SenderEvents.senderError
type SenderSenderEventHandler = (senderEvent: ResolvableSenderEvents) => (context: EventContext) => void
type ErrorSenderEventHandler = (context: EventContext, errorEvent: RejectableSenderEvents, deliveryId: number) => void
type MessageHandlerPromise = {
  resolve: (publishResult: PublishResult) => void
  reject: (error: Error) => void
}

export interface Publisher {
  publish(message: Message): Promise<PublishResult>
  close(): void
  get id(): string
}

export class AmqpPublisher implements Publisher {
  static async createFrom(
    connection: Connection,
    publishersList: Map<string, Publisher>,
    options?: DestinationOptions
  ): Promise<Publisher> {
    const address = createPublisherAddressFrom(options)
    const id = uuid()
    const senderLink = await AmqpPublisher.openSender(connection, id, address)
    return new AmqpPublisher(connection, senderLink, id, publishersList)
  }

  private static async openSender(connection: Connection, publisherId: string, address?: string): Promise<Sender> {
    return openLink<Sender>(
      connection,
      SenderEvents.senderOpen,
      SenderEvents.senderError,
      connection.open_sender.bind(connection),
      getPublisherSenderLinkConfigurationFrom(publisherId, address)
    )
  }

  private successMessageHandler: SenderSenderEventHandler
  private errorMessageHandler: ErrorSenderEventHandler
  private promiseMessagesHandler: Map<number, MessageHandlerPromise> = new Map<number, MessageHandlerPromise>()

  constructor(
    private readonly connection: Connection,
    private senderLink: Sender,
    private readonly _id: string,
    private publishersList: Map<string, Publisher>
  ) {
    console.log(this.connection.container_id)
    this.successMessageHandler = (senderEvent: ResolvableSenderEvents) => {
      return (context: EventContext) => {
        if (context.delivery) {
          const promise = this.promiseMessagesHandler.get(context.delivery.id)
          if (promise) {
            this.promiseMessagesHandler.delete(context.delivery.id)
            return promise.resolve({ delivery: context.delivery, outcome: getOutcomeStateFrom(senderEvent) })
          }
        }
      }
    }
    this.errorMessageHandler = (context: EventContext, errorEvent: RejectableSenderEvents, deliveryId: number) => {
      const promise = this.promiseMessagesHandler.get(deliveryId)
      if (promise) {
        this.promiseMessagesHandler.delete(deliveryId)
        const error = new Error(`SenderLink error ${errorEvent}: ${inspect(context.error)}`)
        return promise.reject(error)
      }
    }

    this.registerEventListeners()
  }

  private registerEventListeners(): void {
    this.senderLink.on(SenderEvents.accepted, this.successMessageHandler(SenderEvents.accepted))
    this.senderLink.on(SenderEvents.rejected, this.successMessageHandler(SenderEvents.rejected))
    this.senderLink.on(SenderEvents.released, this.successMessageHandler(SenderEvents.released))
    this.senderLink.on(SenderEvents.senderError, (context: EventContext) => {
      for (const id of this.promiseMessagesHandler.keys())
        this.errorMessageHandler(context, SenderEvents.senderError, id)
    })
  }

  private removeEventListeners(): void {
    this.senderLink.removeAllListeners()
  }

  async publish(message: Message): Promise<PublishResult> {
    return new Promise<PublishResult>((res, rej) => {
      const delivery = this.senderLink.send(message)
      this.promiseMessagesHandler.set(delivery.id, {
        resolve: (publishResult: PublishResult) => res(publishResult),
        reject: (error: Error) => rej(error),
      })
    })
  }

  close(): void {
    this.removeEventListeners()

    if (this.senderLink.is_open()) this.senderLink.close()
    if (this.publishersList.has(this._id)) this.publishersList.delete(this._id)
  }

  get id(): string {
    return this._id
  }
}

function getOutcomeStateFrom(event: ResolvableSenderEvents): OutcomeState {
  switch (event) {
    case SenderEvents.released:
      return OutcomeState.RELEASED
    case SenderEvents.rejected:
      return OutcomeState.REJECTED
    case SenderEvents.accepted:
      return OutcomeState.ACCEPTED
  }
}
