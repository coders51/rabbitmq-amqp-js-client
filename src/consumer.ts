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
} from "rhea"
import {
  Offset,
  openLink,
  SourceFilter,
  STREAM_FILTER_MATCH_UNFILTERED,
  STREAM_FILTER_SPEC,
  STREAM_OFFSET_SPEC,
} from "./utils.js"
import { QueueOptions } from "./message.js"
import { AmqpDeliveryContext, DeliveryContext } from "./delivery_context.js"
import { AmqpEndpoints } from "./link_message_builder.js"
import { inspect } from "util"

export type ConsumerMessageHandler = (context: DeliveryContext, message: Message) => void

export type StreamOptions = {
  name: string
  offset?: Offset
  filterValues?: string[]
  matchUnfiltered?: boolean
}

export type SourceOptions = { stream: StreamOptions } | { queue: QueueOptions }

export type CreateConsumerParams = SourceOptions & {
  messageHandler: ConsumerMessageHandler
}

const getConsumerReceiverLinkConfigurationFrom = (
  address: string,
  consumerId: string,
  filter?: SourceFilter
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
    filter,
  },
})

export interface Consumer {
  start(): void
  close(): void
  get id(): string
}

export class AmqpConsumer implements Consumer {
  static async createFrom(connection: Connection, consumersList: Map<string, Consumer>, params: CreateConsumerParams) {
    const id = generate_uuid()
    const address = createConsumerAddressFrom(params)
    const filter = createConsumerFilterFrom(params)
    if (!address) throw new Error("Consumer must have an address")

    const receiverLink = await AmqpConsumer.openReceiver(connection, address, id, filter)
    return new AmqpConsumer(id, connection, consumersList, receiverLink, params)
  }

  private static async openReceiver(
    connection: Connection,
    address: string,
    consumerId: string,
    filter?: SourceFilter
  ): Promise<Receiver> {
    return openLink<Receiver>(
      connection,
      ReceiverEvents.receiverOpen,
      ReceiverEvents.receiverError,
      connection.open_receiver.bind(connection),
      getConsumerReceiverLinkConfigurationFrom(address, consumerId, filter)
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
      if (context.message && context.delivery) {
        const deliveryContext = new AmqpDeliveryContext(context.delivery, this.receiverLink)
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

function createConsumerFilterFrom(params: CreateConsumerParams): SourceFilter | undefined {
  if ("queue" in params) {
    return undefined
  }
  if (!params.stream.offset && !params.stream.filterValues) {
    throw new Error("At least one between offset and filterValues must be set when using filtering")
  }

  const filters: Dictionary<string | bigint | boolean | string[]> = {}
  if (params.stream.offset) {
    filters[STREAM_OFFSET_SPEC] = params.stream.offset.toValue()
  }
  if (params.stream.filterValues) {
    filters[STREAM_FILTER_SPEC] = params.stream.filterValues
  }
  if (params.stream.matchUnfiltered) {
    filters[STREAM_FILTER_MATCH_UNFILTERED] = params.stream.matchUnfiltered
  }

  return filters
}

export function createConsumerAddressFrom(params: CreateConsumerParams): string | undefined {
  if ("queue" in params) return `/${AmqpEndpoints.Queues}/${params.queue.name}`
  if ("stream" in params) return `/${AmqpEndpoints.Queues}/${params.stream.name}`

  throw new Error(`Unknown publisher options -- ${inspect(params)}`)
}
