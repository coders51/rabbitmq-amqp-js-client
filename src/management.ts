import { AmqpExchange, Exchange, ExchangeInfo, ExchangeOptions } from "./exchange.js"
import { AmqpQueue, Queue, QueueType, QueueOptions, QuorumQueueOptions, ClassicQueueOptions } from "./queue.js"
import {
  EventContext,
  Message,
  Receiver,
  ReceiverEvents,
  ReceiverOptions,
  Connection as RheaConnection,
  Sender,
  SenderOptions,
  generate_uuid,
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
import { openReceiver, openSender } from "./rhea_wrapper.js"
import { Result } from "./utils.js"

export const MANAGEMENT_NODE_CONFIGURATION: SenderOptions | ReceiverOptions = {
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
  getQueueInfo: (queueName: string) => Promise<Queue>
  declareExchange: (exchangeName: string, options?: Partial<ExchangeOptions>) => Promise<Exchange>
  deleteExchange: (exchangeName: string) => Promise<boolean>
  bind: (key: string, options: BindingOptions) => Promise<Binding>
  unbind: (key: string, options: BindingOptions) => Promise<boolean>
  refreshToken: (token: string) => Promise<boolean>
  close: () => void
}

const TIMEOUT = 30_000

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

  private sendRequest<TBody, TResult>(
    sentMessage: Message,
    decoder: { decodeFrom: (message: Message, sentMessageId: string) => Result<TBody, Error> },
    transform: (body: TBody) => TResult,
    timeoutLabel: string
  ): Promise<TResult> {
    return new Promise((res, rej) => {
      let settled = false
      const handler = (context: EventContext): void => {
        if (settled) return
        const message = context.message
        if (!message) return
        if (String(message.correlation_id) !== String(sentMessage.message_id)) return

        settled = true
        clearTimeout(timer)
        this.receiverLink.removeListener(ReceiverEvents.message, handler)

        const response = decoder.decodeFrom(message, String(sentMessage.message_id))
        if (response.status === "error") {
          rej(response.error)
        } else {
          res(transform(response.body))
        }
      }

      this.receiverLink.on(ReceiverEvents.message, handler)
      this.senderLink.send(sentMessage)

      const timer = setTimeout(() => {
        if (settled) return
        settled = true
        this.receiverLink.removeListener(ReceiverEvents.message, handler)
        rej(new Error(`${timeoutLabel} timed out after ${TIMEOUT / 1000}s`))
      }, TIMEOUT)
    })
  }

  async declareQueue(queueName: string, options: Partial<QueueOptions> = {}): Promise<Queue> {
    const sentMessage = new LinkMessageBuilder()
      .sendTo(`/${AmqpEndpoints.Queues}/${encodeURIComponent(queueName)}`)
      .setReplyTo(ME)
      .setAmqpMethod(AmqpMethods.PUT)
      .setBody(buildDeclareQueueBody(options))
      .build()
    return this.sendRequest(
      sentMessage,
      new CreateQueueResponseDecoder(),
      (body) => new AmqpQueue(body),
      `declareQueue '${queueName}'`
    )
  }

  async deleteQueue(queueName: string): Promise<boolean> {
    const sentMessage = new LinkMessageBuilder()
      .sendTo(`/${AmqpEndpoints.Queues}/${encodeURIComponent(queueName)}`)
      .setReplyTo(ME)
      .setAmqpMethod(AmqpMethods.DELETE)
      .build()
    return this.sendRequest(sentMessage, new DeleteQueueResponseDecoder(), () => true, `deleteQueue '${queueName}'`)
  }

  async getQueueInfo(queueName: string): Promise<Queue> {
    const sentMessage = new LinkMessageBuilder()
      .sendTo(`/${AmqpEndpoints.Queues}/${encodeURIComponent(queueName)}`)
      .setReplyTo(ME)
      .setAmqpMethod(AmqpMethods.GET)
      .build()
    return this.sendRequest(
      sentMessage,
      new GetQueueInfoResponseDecoder(),
      (body) => new AmqpQueue(body),
      `getQueueInfo '${queueName}'`
    )
  }

  async declareExchange(exchangeName: string, options: Partial<ExchangeOptions> = {}): Promise<Exchange> {
    const exchangeInfo: ExchangeInfo = {
      type: options.type ?? "direct",
      arguments: options.arguments ?? {},
      autoDelete: options.auto_delete ?? false,
      durable: options.durable ?? true,
      name: exchangeName,
    }
    const sentMessage = new LinkMessageBuilder()
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
    return this.sendRequest(
      sentMessage,
      new CreateExchangeResponseDecoder(),
      () => new AmqpExchange(exchangeInfo),
      `declareExchange '${exchangeName}'`
    )
  }

  async deleteExchange(exchangeName: string): Promise<boolean> {
    const sentMessage = new LinkMessageBuilder()
      .sendTo(`/${AmqpEndpoints.Exchanges}/${encodeURIComponent(exchangeName)}`)
      .setReplyTo(ME)
      .setAmqpMethod(AmqpMethods.DELETE)
      .build()
    return this.sendRequest(
      sentMessage,
      new DeleteExchangeResponseDecoder(),
      () => true,
      `deleteExchange '${exchangeName}'`
    )
  }

  async bind(key: string, options: BindingOptions): Promise<Binding> {
    const bindingInfo: BindingInfo = {
      id: generate_uuid(),
      source: options.source.getInfo.name,
      destination: options.destination.getInfo.name,
      arguments: options.arguments ?? {},
    }
    const sentMessage = new LinkMessageBuilder()
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
    return this.sendRequest(
      sentMessage,
      new CreateBindingResponseDecoder(),
      () => new AmqpBinding(bindingInfo),
      `bind '${key}'`
    )
  }

  async unbind(key: string, options: BindingOptions): Promise<boolean> {
    const sentMessage = new LinkMessageBuilder()
      .sendTo(
        `/${AmqpEndpoints.Bindings}/${buildUnbindEndpointFrom({ source: options.source, destination: options.destination, key })}`
      )
      .setReplyTo(ME)
      .setAmqpMethod(AmqpMethods.DELETE)
      .build()
    return this.sendRequest(sentMessage, new DeleteBindingResponseDecoder(), () => true, `unbind '${key}'`)
  }

  async refreshToken(token: string): Promise<boolean> {
    const sentMessage = new LinkMessageBuilder()
      .sendTo(`/${AmqpEndpoints.AuthTokens}`)
      .setReplyTo(ME)
      .setAmqpMethod(AmqpMethods.PUT)
      .setBody(Buffer.from(token, "ascii"))
      .build()
    return this.sendRequest(sentMessage, new RefreshTokensResponseDecoder(), () => true, "refreshToken")
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
