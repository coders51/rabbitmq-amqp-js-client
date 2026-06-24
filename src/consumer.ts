import {
  generate_uuid,
  Receiver,
  ReceiverEvents,
  ReceiverOptions,
  Connection,
  SenderOptions,
  EventContext,
  Message,
  Dictionary,
  types,
  Typed,
  MessageProperties,
} from "rhea"
import {
  Offset,
  SourceFilter,
  STREAM_FILTER_MATCH_UNFILTERED,
  STREAM_FILTER_SPEC,
  STREAM_OFFSET_SPEC,
  STREAM_FILTER_SQL,
  STREAM_FILTER_MESSAGE_PROPERTIES,
  STREAM_FILTER_APPLICATION_PROPERTIES,
} from "./utils.js"
import { openLink } from "./rhea_wrapper.js"
import { createConsumerAddressFrom } from "./message.js"
import { QueueOptions } from "./message.js"
import { AmqpDeliveryContext, DeliveryContext, PreSettledDeliveryContext } from "./delivery_context.js"

export type ConsumerMessageHandler = (context: DeliveryContext, message: Message) => void

export type StreamOptions = {
  name: string
  offset?: Offset
  filterValues?: string[]
  messagePropertiesFilter?: MessageProperties
  applicationPropertiesFilter?: Dictionary<string>
  sqlFilter?: string
  matchUnfiltered?: boolean
}

export type SourceOptions = { stream: StreamOptions } | { queue: QueueOptions }

export type QueueConsumerParams = SourceOptions & {
  preSettled?: boolean
  messageHandler: ConsumerMessageHandler
}

export type DirectReplyToConsumerParams = {
  directReplyTo: true
  messageHandler: ConsumerMessageHandler
}

export type CreateConsumerParams = QueueConsumerParams | DirectReplyToConsumerParams

const getConsumerReceiverLinkConfigurationFrom = (
  address: string,
  consumerId: string,
  preSettled: boolean,
  filter?: SourceFilter
): SenderOptions | ReceiverOptions => ({
  snd_settle_mode: preSettled ? 1 : 0,
  rcv_settle_mode: 0,
  autoaccept: preSettled,
  autosettle: preSettled,
  name: consumerId,
  target: { address, expiry_policy: "SESSION_END", durable: 0, dynamic: false },
  source: {
    address,
    expiry_policy: "LINK_DETACH",
    timeout: 0,
    dynamic: false,
    durable: 0,
    filter,
  },
})

const getDirectReplyToReceiverLinkConfiguration = (consumerId: string): ReceiverOptions => ({
  snd_settle_mode: 1,
  rcv_settle_mode: 0,
  autoaccept: true,
  autosettle: true,
  name: consumerId,
  source: {
    address: null as unknown as string,
    dynamic: true,
    expiry_policy: "link-detach",
    timeout: 0,
    capabilities: ["rabbitmq:volatile-queue"],
  },
})

export interface Consumer {
  start(): void
  close(): void
  get id(): string
  get replyTo(): string | undefined
}

export class AmqpConsumer implements Consumer {
  private static readonly PRE_SETTLED_DELIVERY_CONTEXT = new PreSettledDeliveryContext()

  static async createFrom(connection: Connection, consumersList: Map<string, Consumer>, params: CreateConsumerParams) {
    const id = generate_uuid()

    if ("directReplyTo" in params && params.directReplyTo) {
      const receiverLink = await AmqpConsumer.openDirectReplyToReceiver(connection, id)
      return new AmqpConsumer(id, connection, consumersList, receiverLink, params)
    }

    const sourceParams = params as QueueConsumerParams
    const address = createConsumerAddressFrom(sourceParams)
    const filter = createConsumerFilterFrom(sourceParams)
    if (!address) throw new Error("Consumer must have an address")
    const preSettled = sourceParams.preSettled ?? false
    const receiverLink = await AmqpConsumer.openReceiver(connection, address, id, preSettled, filter)
    return new AmqpConsumer(id, connection, consumersList, receiverLink, params)
  }

  private static async openReceiver(
    connection: Connection,
    address: string,
    consumerId: string,
    preSettled: boolean,
    filter?: SourceFilter
  ): Promise<Receiver> {
    return openLink<Receiver>(
      connection,
      ReceiverEvents.receiverOpen,
      ReceiverEvents.receiverError,
      connection.open_receiver.bind(connection),
      getConsumerReceiverLinkConfigurationFrom(address, consumerId, preSettled, filter)
    )
  }

  private static async openDirectReplyToReceiver(connection: Connection, consumerId: string): Promise<Receiver> {
    return openLink<Receiver>(
      connection,
      ReceiverEvents.receiverOpen,
      ReceiverEvents.receiverError,
      connection.open_receiver.bind(connection),
      getDirectReplyToReceiverLinkConfiguration(consumerId)
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

  get replyTo(): string | undefined {
    return this.receiverLink.source?.address
  }

  start() {
    this.receiverLink.on(ReceiverEvents.message, (context: EventContext) => {
      if (context.message && context.delivery) {
        const isPreSettled =
          "directReplyTo" in this.params ? true : ((this.params as QueueConsumerParams).preSettled ?? false)
        const deliveryContext = isPreSettled
          ? AmqpConsumer.PRE_SETTLED_DELIVERY_CONTEXT
          : new AmqpDeliveryContext(context.delivery, this.receiverLink)
        this.params.messageHandler(deliveryContext, context.message)
      }
    })
  }

  close() {
    this.receiverLink.removeAllListeners()
    if (this.receiverLink.is_open()) this.receiverLink.close()
    if (this.consumersList.has(this._id)) this.consumersList.delete(this._id)
  }
}

function createConsumerFilterFrom(params: QueueConsumerParams): SourceFilter | undefined {
  if ("queue" in params) {
    return undefined
  }
  if (!params.stream.offset && !params.stream.filterValues) {
    throw new Error("At least one between offset and filterValues must be set when using filtering")
  }

  const filters: Dictionary<string | bigint | boolean | string[] | Typed> = {}
  if (params.stream.offset) {
    filters[STREAM_OFFSET_SPEC] = params.stream.offset.toValue()
  }
  if (params.stream.filterValues) {
    filters[STREAM_FILTER_SPEC] = params.stream.filterValues
  }
  if (params.stream.sqlFilter) {
    filters[STREAM_FILTER_SQL] = types.wrap_described(params.stream.sqlFilter, 0x120)
  }
  if (params.stream.matchUnfiltered) {
    filters[STREAM_FILTER_MATCH_UNFILTERED] = params.stream.matchUnfiltered
  }
  if (params.stream.messagePropertiesFilter) {
    const symbolicMap = types.wrap_symbolic_map(params.stream.messagePropertiesFilter)
    filters[STREAM_FILTER_MESSAGE_PROPERTIES] = types.wrap_described(symbolicMap, 0x173)
  }
  if (params.stream.applicationPropertiesFilter) {
    const map = types.wrap_map(params.stream.applicationPropertiesFilter)
    filters[STREAM_FILTER_APPLICATION_PROPERTIES] = types.wrap_described(map, 0x174)
  }

  return filters
}
