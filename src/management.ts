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
import { wait } from "./utils.js"

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

export class AmqpManagement implements Management {
  static async create(connection: RheaConnection): Promise<AmqpManagement> {
    const senderLink = await openSender(connection)
    const receiverLink = await openReceiver(connection)
    await wait(500)
    return new AmqpManagement(connection, senderLink, receiverLink)
  }

  private readonly pendingRequests = new Map<
    string,
    { resolve: (msg: Message) => void; reject: (err: Error) => void }
  >()

  constructor(
    private readonly connection: RheaConnection,
    private senderLink: Sender,
    private receiverLink: Receiver
  ) {
    this.startResponseRouter()
  }

  private startResponseRouter(): void {
    this.receiverLink.on(ReceiverEvents.message, (context: EventContext) => {
      if (!context.message) return
      const correlationId = String(context.message.correlation_id)
      const pending = this.pendingRequests.get(correlationId)
      if (pending) {
        this.pendingRequests.delete(correlationId)
        pending.resolve(context.message)
      }
    })
  }

  private sendAndAwait(message: Message): Promise<Message> {
    return new Promise((resolve, reject) => {
      this.pendingRequests.set(String(message.message_id), { resolve, reject })
      this.senderLink.send(message)
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
    const message = new LinkMessageBuilder()
      .sendTo(`/${AmqpEndpoints.Queues}/${encodeURIComponent(queueName)}`)
      .setReplyTo(ME)
      .setAmqpMethod(AmqpMethods.PUT)
      .setBody(buildDeclareQueueBody(options))
      .build()
    const responseMessage = await this.sendAndAwait(message)
    const response = new CreateQueueResponseDecoder().decodeFrom(responseMessage, String(message.message_id))
    if (response.status === "error") throw response.error
    return new AmqpQueue(response.body)
  }

  async deleteQueue(queueName: string): Promise<boolean> {
    const message = new LinkMessageBuilder()
      .sendTo(`/${AmqpEndpoints.Queues}/${encodeURIComponent(queueName)}`)
      .setReplyTo(ME)
      .setAmqpMethod(AmqpMethods.DELETE)
      .build()
    const responseMessage = await this.sendAndAwait(message)
    const response = new DeleteQueueResponseDecoder().decodeFrom(responseMessage, String(message.message_id))
    if (response.status === "error") throw response.error
    return true
  }

  async getQueueInfo(queueName: string): Promise<Queue> {
    const message = new LinkMessageBuilder()
      .sendTo(`/${AmqpEndpoints.Queues}/${encodeURIComponent(queueName)}`)
      .setReplyTo(ME)
      .setAmqpMethod(AmqpMethods.GET)
      .build()
    const responseMessage = await this.sendAndAwait(message)
    const response = new GetQueueInfoResponseDecoder().decodeFrom(responseMessage, String(message.message_id))
    if (response.status === "error") throw response.error
    return new AmqpQueue(response.body)
  }

  async declareExchange(exchangeName: string, options: Partial<ExchangeOptions> = {}): Promise<Exchange> {
    const exchangeInfo: ExchangeInfo = {
      type: options.type ?? "direct",
      arguments: options.arguments ?? {},
      autoDelete: options.auto_delete ?? false,
      durable: options.durable ?? true,
      name: exchangeName,
    }
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
    const responseMessage = await this.sendAndAwait(message)
    const response = new CreateExchangeResponseDecoder().decodeFrom(responseMessage, String(message.message_id))
    if (response.status === "error") throw response.error
    return new AmqpExchange(exchangeInfo)
  }

  async deleteExchange(exchangeName: string): Promise<boolean> {
    const message = new LinkMessageBuilder()
      .sendTo(`/${AmqpEndpoints.Exchanges}/${encodeURIComponent(exchangeName)}`)
      .setReplyTo(ME)
      .setAmqpMethod(AmqpMethods.DELETE)
      .build()
    const responseMessage = await this.sendAndAwait(message)
    const response = new DeleteExchangeResponseDecoder().decodeFrom(responseMessage, String(message.message_id))
    if (response.status === "error") throw response.error
    return true
  }

  async bind(key: string, options: BindingOptions): Promise<Binding> {
    const bindingInfo: BindingInfo = {
      id: generate_uuid(),
      source: options.source.getInfo.name,
      destination: options.destination.getInfo.name,
      arguments: options.arguments ?? {},
    }
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
    const responseMessage = await this.sendAndAwait(message)
    const response = new CreateBindingResponseDecoder().decodeFrom(responseMessage, String(message.message_id))
    if (response.status === "error") throw response.error
    return new AmqpBinding(bindingInfo)
  }

  async unbind(key: string, options: BindingOptions): Promise<boolean> {
    const message = new LinkMessageBuilder()
      .sendTo(
        `/${AmqpEndpoints.Bindings}/${buildUnbindEndpointFrom({ source: options.source, destination: options.destination, key })}`
      )
      .setReplyTo(ME)
      .setAmqpMethod(AmqpMethods.DELETE)
      .build()
    const responseMessage = await this.sendAndAwait(message)
    const response = new DeleteBindingResponseDecoder().decodeFrom(responseMessage, String(message.message_id))
    if (response.status === "error") throw response.error
    return true
  }

  async refreshToken(token: string): Promise<boolean> {
    const message = new LinkMessageBuilder()
      .sendTo(`/${AmqpEndpoints.AuthTokens}`)
      .setReplyTo(ME)
      .setAmqpMethod(AmqpMethods.PUT)
      .setBody(Buffer.from(token, "ascii"))
      .build()
    const responseMessage = await this.sendAndAwait(message)
    const response = new RefreshTokensResponseDecoder().decodeFrom(responseMessage, String(message.message_id))
    if (response.status === "error") throw response.error
    return true
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
