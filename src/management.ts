import { AmqpExchange, Exchange, ExchangeInfo, ExchangeOptions } from "./exchange.js"
import { AmqpQueue, Queue, QueueOptions, QueueType } from "./queue.js"
import {
  EventContext,
  Receiver,
  ReceiverEvents,
  ReceiverOptions,
  Connection as RheaConnection,
  Sender,
  SenderEvents,
  SenderOptions,
} from "rhea"
import { AmqpEndpoints, AmqpMethods, MessageBuilder, ME } from "./message_builder.js"
import {
  CreateBindingResponseDecoder,
  CreateExchangeResponseDecoder,
  CreateQueueResponseDecoder,
  DeleteBindingResponseDecoder,
  DeleteExchangeResponseDecoder,
  DeleteQueueResponseDecoder,
} from "./response_decoder.js"
import { AmqpBinding, Binding, BindingInfo, BindingOptions } from "./binding.js"
import { randomUUID } from "crypto"

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
  declareQueue: (queueName: string, options?: Partial<QueueOptions>) => Promise<Queue>
  deleteQueue: (queueName: string) => Promise<boolean>
  declareExchange: (exchangeName: string, options?: Partial<ExchangeOptions>) => Promise<Exchange>
  deleteExchange: (exchangeName: string) => Promise<boolean>
  bind: (key: string, options: BindingOptions) => Promise<Binding>
  unbind: (key: string, options: BindingOptions) => Promise<boolean>
  close: () => void
}

export class AmqpManagement implements Management {
  static async create(connection: RheaConnection): Promise<AmqpManagement> {
    const senderLink = await AmqpManagement.openSender(connection)
    const receiverLink = await AmqpManagement.openReceiver(connection)
    return new AmqpManagement(connection, senderLink, receiverLink)
  }

  constructor(
    private readonly connection: RheaConnection,
    private senderLink: Sender,
    private receiverLink: Receiver
  ) {}

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

  close(): void {
    if (this.connection.is_closed()) return

    this.closeSender()
    this.closeReceiver()
  }

  private closeSender(): void {
    this.senderLink.close()
  }

  private closeReceiver(): void {
    this.senderLink.close()
  }

  async declareQueue(queueName: string, options: Partial<QueueOptions> = {}): Promise<Queue> {
    return new Promise((res, rej) => {
      this.receiverLink.once(ReceiverEvents.message, (context: EventContext) => {
        if (!context.message) {
          return rej(new Error("Receiver has not received any message"))
        }

        const response = new CreateQueueResponseDecoder().decodeFrom(context.message, String(message.message_id))
        if (response.status === "error") {
          return rej(response.error)
        }

        return res(new AmqpQueue(response.body))
      })

      const message = new MessageBuilder()
        .sendTo(`/${AmqpEndpoints.Queues}/${encodeURIComponent(queueName)}`)
        .setReplyTo(ME)
        .setAmqpMethod(AmqpMethods.PUT)
        .setBody({
          exclusive: options.exclusive ?? false,
          durable: options.durable ?? false,
          auto_delete: options.autoDelete ?? false,
          arguments: buildArgumentsFrom(options.type, options.arguments),
        })
        .build()
      this.senderLink.send(message)
    })
  }

  async deleteQueue(queueName: string): Promise<boolean> {
    return new Promise((res, rej) => {
      this.receiverLink.once(ReceiverEvents.message, (context: EventContext) => {
        if (!context.message) {
          return rej(new Error("Receiver has not received any message"))
        }

        const response = new DeleteQueueResponseDecoder().decodeFrom(context.message, String(message.message_id))
        if (response.status === "error") {
          return rej(response.error)
        }

        return res(true)
      })

      const message = new MessageBuilder()
        .sendTo(`/${AmqpEndpoints.Queues}/${encodeURIComponent(queueName)}`)
        .setReplyTo(ME)
        .setAmqpMethod(AmqpMethods.DELETE)
        .build()
      this.senderLink.send(message)
    })
  }

  async declareExchange(exchangeName: string, options: Partial<ExchangeOptions> = {}): Promise<Exchange> {
    const exchangeInfo: ExchangeInfo = {
      type: options.type ?? "direct",
      arguments: options.arguments ?? {},
      autoDelete: options.auto_delete ?? false,
      durable: options.durable ?? true,
      name: exchangeName,
    }
    return new Promise((res, rej) => {
      this.receiverLink.once(ReceiverEvents.message, (context: EventContext) => {
        if (!context.message) {
          return rej(new Error("Receiver has not received any message"))
        }

        const response = new CreateExchangeResponseDecoder().decodeFrom(context.message, String(message.message_id))
        if (response.status === "error") {
          return rej(response.error)
        }

        return res(new AmqpExchange(exchangeInfo))
      })

      const message = new MessageBuilder()
        .sendTo(`/${AmqpEndpoints.Exchanges}/${encodeURIComponent(exchangeName)}`)
        .setReplyTo(ME)
        .setAmqpMethod(AmqpMethods.PUT)
        .setBody({
          type: options.type ?? "direct",
          durable: options.durable ?? true,
          auto_delete: options.auto_delete ?? false,
        })
        .build()

      this.senderLink.send(message)
    })
  }

  async deleteExchange(exchangeName: string): Promise<boolean> {
    return new Promise((res, rej) => {
      this.receiverLink.once(ReceiverEvents.message, (context: EventContext) => {
        if (!context.message) {
          return rej(new Error("Receiver has not received any message"))
        }

        const response = new DeleteExchangeResponseDecoder().decodeFrom(context.message, String(message.message_id))
        if (response.status === "error") {
          return rej(response.error)
        }

        return res(true)
      })

      const message = new MessageBuilder()
        .sendTo(`/${AmqpEndpoints.Exchanges}/${encodeURIComponent(exchangeName)}`)
        .setReplyTo(ME)
        .setAmqpMethod(AmqpMethods.DELETE)
        .build()
      this.senderLink.send(message)
    })
  }

  async bind(key: string, options: BindingOptions): Promise<Binding> {
    const bindingInfo: BindingInfo = {
      id: randomUUID(),
      source: options.source.getInfo.name,
      destination: options.destination.getInfo.name,
      arguments: options.arguments ?? {},
    }
    return new Promise((res, rej) => {
      this.receiverLink.once(ReceiverEvents.message, (context: EventContext) => {
        if (!context.message) {
          return rej(new Error("Receiver has not received any message"))
        }

        const response = new CreateBindingResponseDecoder().decodeFrom(context.message, String(message.message_id))
        if (response.status === "error") {
          return rej(response.error)
        }

        return res(new AmqpBinding(bindingInfo))
      })

      const message = new MessageBuilder()
        .sendTo(`/${AmqpEndpoints.Bindings}`)
        .setReplyTo(ME)
        .setAmqpMethod(AmqpMethods.POST)
        .setBody({
          source: options.source.getInfo.name,
          binding_key: key,
          arguments: options.arguments ?? {},
          ...buildBindingDestinationFrom(options.destination),
        })
        .build()
      this.senderLink.send(message)
    })
  }

  async unbind(key: string, options: BindingOptions): Promise<boolean> {
    return new Promise((res, rej) => {
      this.receiverLink.once(ReceiverEvents.message, (context: EventContext) => {
        if (!context.message) {
          return rej(new Error("Receiver has not received any message"))
        }

        const response = new DeleteBindingResponseDecoder().decodeFrom(context.message, String(message.message_id))
        if (response.status === "error") {
          return rej(response.error)
        }

        return res(true)
      })

      const message = new MessageBuilder()
        .sendTo(
          `/${AmqpEndpoints.Bindings}/${buildUnbindEndpointFrom({ source: options.source, destination: options.destination, key })}`
        )
        .setReplyTo(ME)
        .setAmqpMethod(AmqpMethods.DELETE)
        .build()
      this.senderLink.send(message)
    })
  }
}

function buildArgumentsFrom(queueType?: QueueType, queueOptions?: Record<string, string>) {
  return { ...(queueOptions ?? {}), ...(queueType ? { "x-queue-type": queueType } : {}) }
}

function buildUnbindEndpointFrom({
  source,
  destination,
  key,
}: {
  source: Exchange
  destination: Exchange | Queue
  key: string
}): string {
  if (destination instanceof AmqpExchange) {
    return `src=${encodeURIComponent(source.getInfo.name)};dste=${encodeURIComponent(destination.getInfo.name)};key=${encodeURIComponent(key)};args=`
  }

  return `src=${encodeURIComponent(source.getInfo.name)};dstq=${encodeURIComponent(destination.getInfo.name)};key=${encodeURIComponent(key)};args=`
}

function buildBindingDestinationFrom(destination: Exchange | Queue) {
  if (destination instanceof AmqpExchange) {
    return { destination_exchange: destination.getInfo.name }
  }

  return { destination_queue: destination.getInfo.name }
}
