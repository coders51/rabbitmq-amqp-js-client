import { AmqpExchange, Exchange, ExchangeInfo, ExchangeOptions } from "./exchange.js"
import { AmqpQueue, Queue, QueueType, QueueOptions, QuorumQueueOptions, ClassicQueueOptions } from "./queue.js"
import {
  EventContext,
  Receiver,
  ReceiverEvents,
  ReceiverOptions,
  Connection as RheaConnection,
  Sender,
  SenderOptions,
} from "rhea"
import { AmqpEndpoints, AmqpMethods, LinkMessageBuilder, ME } from "./link_message_builder.js"
import {
  CreateBindingResponseDecoder,
  CreateExchangeResponseDecoder,
  CreateQueueResponseDecoder,
  DeleteBindingResponseDecoder,
  DeleteExchangeResponseDecoder,
  DeleteQueueResponseDecoder,
  GetQueueInfoResponseDecoder,
  RefreshTokensResponseDecoder,
} from "./response_decoder.js"
import { AmqpBinding, Binding, BindingInfo, BindingOptions } from "./binding.js"
import { randomUUID } from "crypto"
import { openReceiver, openSender } from "./rhea_wrapper.js"

export const MANAGEMENT_NODE_CONFIGURATION: SenderOptions | ReceiverOptions = {
  snd_settle_mode: 1,
  rcv_settle_mode: 0,
  name: "management-link-pair",
  target: { address: "/management", expiry_policy: "LINK_DETACH", timeout: 0, dynamic: false },
  source: { address: "/management", expiry_policy: "LINK_DETACH", timeout: 0, dynamic: false, durable: 0 },
  properties: { paired: true },
}

export interface Management {
  refreshToken(token: string): Promise<boolean>
  declareQueue: (queueName: string, options?: Partial<QueueOptions>) => Promise<Queue>
  deleteQueue: (queueName: string) => Promise<boolean>
  getQueueInfo: (queueName: string) => Promise<Queue>
  declareExchange: (exchangeName: string, options?: Partial<ExchangeOptions>) => Promise<Exchange>
  deleteExchange: (exchangeName: string) => Promise<boolean>
  bind: (key: string, options: BindingOptions) => Promise<Binding>
  unbind: (key: string, options: BindingOptions) => Promise<boolean>
  refreshToken: (token: string) => Promise<boolean>
  close: () => void
}

export class AmqpManagement implements Management {
  static async create(connection: RheaConnection): Promise<AmqpManagement> {
    const senderLink = await openSender(connection)
    const receiverLink = await openReceiver(connection)
    return new AmqpManagement(connection, senderLink, receiverLink)
  }

  constructor(
    private readonly connection: RheaConnection,
    private senderLink: Sender,
    private receiverLink: Receiver
  ) {}

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

      const message = new LinkMessageBuilder()
        .sendTo(`/${AmqpEndpoints.Queues}/${encodeURIComponent(queueName)}`)
        .setReplyTo(ME)
        .setAmqpMethod(AmqpMethods.PUT)
        .setBody(buildDeclareQueueBody(options))
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

      const message = new LinkMessageBuilder()
        .sendTo(`/${AmqpEndpoints.Queues}/${encodeURIComponent(queueName)}`)
        .setReplyTo(ME)
        .setAmqpMethod(AmqpMethods.DELETE)
        .build()
      this.senderLink.send(message)
    })
  }

  async getQueueInfo(queueName: string): Promise<Queue> {
    return new Promise((res, rej) => {
      this.receiverLink.once(ReceiverEvents.message, (context: EventContext) => {
        if (!context.message) {
          return rej(new Error("Receiver has not received any message"))
        }

        const response = new GetQueueInfoResponseDecoder().decodeFrom(context.message, String(message.message_id))
        if (response.status === "error") {
          return rej(response.error)
        }

        return res(new AmqpQueue(response.body))
      })

      const message = new LinkMessageBuilder()
        .sendTo(`/${AmqpEndpoints.Queues}/${encodeURIComponent(queueName)}`)
        .setReplyTo(ME)
        .setAmqpMethod(AmqpMethods.GET)
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

      const message = new LinkMessageBuilder()
        .sendTo(`/${AmqpEndpoints.Exchanges}/${encodeURIComponent(exchangeName)}`)
        .setReplyTo(ME)
        .setAmqpMethod(AmqpMethods.PUT)
        .setBody({
          type: options.type ?? "direct",
          durable: options.durable ?? true,
          auto_delete: options.auto_delete ?? false,
          arguments: options.arguments ?? {},
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

      const message = new LinkMessageBuilder()
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

      const message = new LinkMessageBuilder()
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

      const message = new LinkMessageBuilder()
        .sendTo(
          `/${AmqpEndpoints.Bindings}/${buildUnbindEndpointFrom({ source: options.source, destination: options.destination, key })}`
        )
        .setReplyTo(ME)
        .setAmqpMethod(AmqpMethods.DELETE)
        .build()
      this.senderLink.send(message)
    })
  }

  async refreshToken(token: string): Promise<boolean> {
    return new Promise((res, rej) => {
      this.receiverLink.once(ReceiverEvents.message, (context: EventContext) => {
        if (!context.message) {
          return rej(new Error("Receiver has not received any message"))
        }

        const response = new RefreshTokensResponseDecoder().decodeFrom(context.message, String(message.message_id))
        if (response.status === "error") {
          return rej(response.error)
        }

        return res(true)
      })

      const message = new LinkMessageBuilder()
        .sendTo(`/${AmqpEndpoints.AuthTokens}`)
        .setReplyTo(ME)
        .setAmqpMethod(AmqpMethods.PUT)
        .setBody(Buffer.from(token, "ascii"))
        .build()
      this.senderLink.send(message)
    })
  }
}

function buildDeclareQueueBody(options: Partial<QueueOptions>) {
  const body = {
    exclusive: options.exclusive ?? false,
    durable: options.durable ?? true, // needed at least by quorum queue type
    auto_delete: options.autoDelete ?? false,
    arguments: buildArgumentsFrom(options.type, options.arguments),
  }
  switch (options.type) {
    case "quorum":
      body.arguments = addQuorumArgumentsFrom(body.arguments, options)
      return body
    case "classic":
      body.arguments = addClassicArgumentsFrom(body.arguments, options)
      return body
    case "stream":
    default:
      return body
  }
}

function addQuorumArgumentsFrom(args: Record<string, unknown>, options: Partial<QuorumQueueOptions>) {
  return {
    ...args,
    ...(options.deadLetterStrategy ? { "x-dead-letter-strategy": options.deadLetterStrategy } : {}),
    ...(options.deliveryLimit ? { "x-max-delivery-limit": options.deliveryLimit } : {}),
    ...(options.initialGroupSize ? { "x-quorum-initial-group-size": options.initialGroupSize } : {}),
    ...(options.targetGroupSize ? { "x-quorum-target-group-size": options.targetGroupSize } : {}),
  }
}

function addClassicArgumentsFrom(args: Record<string, unknown>, options: Partial<ClassicQueueOptions>) {
  return {
    ...args,
    ...(options.maxPriority ? { "x-max-priority": options.maxPriority } : {}),
    ...(options.mode ? { "x-queue-mode": options.mode } : {}),
    ...(options.version ? { "x-queue-version": options.version } : {}),
  }
}

function buildArgumentsFrom(queueType?: QueueType, queueOptions?: Record<string, string>): Record<string, unknown> {
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
