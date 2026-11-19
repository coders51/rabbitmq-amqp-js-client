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
  OffsetType,
  bigintTo64BitBuffer,
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

export type ConsumerPriority = number

export type SourceOptions =
  | { stream: StreamOptions; priority?: never }
  | { queue: QueueOptions; priority?: ConsumerPriority }

export type QueueConsumerParams = SourceOptions & {
  preSettled?: boolean
  initialCredits?: number
  messageHandler: ConsumerMessageHandler
}

export type DirectReplyToConsumerParams = {
  directReplyTo: true
  messageHandler: ConsumerMessageHandler
}

export type CreateConsumerParams = QueueConsumerParams | DirectReplyToConsumerParams

const buildCreditWindow = (preSettled: boolean, initialCredits?: number) => {
  if (!initialCredits) return {}
  return { credit_window: preSettled ? initialCredits : 0 }
}

const isInvalidInitialCredits = (initialCredits?: number) =>
  typeof initialCredits === "number" && (!Number.isInteger(initialCredits) || initialCredits <= 0)

const remainingCredit = (credits: number, unsettledCount: number, settledCount: number) =>
  credits - unsettledCount - settledCount

const shouldReturnSettledCredits = (settledCount: number, remaining: number) => settledCount >= remaining

const CONSUMER_PRIORITY_PROPERTY = "rabbitmq:priority"
const INT32_MIN = -(2 ** 31)
const INT32_MAX = 2 ** 31 - 1

export const getConsumerReceiverLinkConfigurationFrom = (
  address: string,
  consumerId: string,
  preSettled: boolean,
  filter?: SourceFilter,
  initialCredits?: number,
  priority?: ConsumerPriority
): SenderOptions | ReceiverOptions => ({
  ...buildCreditWindow(preSettled, initialCredits),
  properties: createLinkPropertiesFrom(priority),
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
  private started = false
  private linkNumber = 0
  private unsettledCount = 0
  private settledSinceLastReturn = 0

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
    const initialCredits = sourceParams.initialCredits
    if (isInvalidInitialCredits(initialCredits)) {
      throw new Error("initialCredits must be a positive integer")
    }
    const priority = validateConsumerPriority(sourceParams.priority)
    const receiverLink = await AmqpConsumer.openReceiver(
      connection,
      address,
      id,
      preSettled,
      filter,
      initialCredits,
      priority
    )
    return new AmqpConsumer(id, connection, consumersList, receiverLink, params)
  }

  private static async openReceiver(
    connection: Connection,
    address: string,
    consumerId: string,
    preSettled: boolean,
    filter?: SourceFilter,
    initialCredits?: number,
    priority?: ConsumerPriority
  ): Promise<Receiver> {
    return openLink<Receiver>(
      connection,
      ReceiverEvents.receiverOpen,
      ReceiverEvents.receiverError,
      connection.open_receiver.bind(connection),
      getConsumerReceiverLinkConfigurationFrom(address, consumerId, preSettled, filter, initialCredits, priority)
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
    if (this.started) return
    this.started = true
    this.receiverLink.on(ReceiverEvents.message, (context: EventContext) => {
      if (context.message && context.delivery) {
        const deliveryContext = this.isPreSettled
          ? AmqpConsumer.PRE_SETTLED_DELIVERY_CONTEXT
          : new AmqpDeliveryContext(context.delivery, this.receiverLink, this.trackDelivery())
        this.params.messageHandler(deliveryContext, context.message)
      }
    })
    const manualCredits = this.manualCredits
    if (manualCredits) {
      this.receiverLink.on(ReceiverEvents.receiverOpen, () => this.restoreCredit(manualCredits))
      this.receiverLink.add_credit(manualCredits)
    }
  }

  private get isPreSettled() {
    return "directReplyTo" in this.params || !!this.params.preSettled
  }

  private get manualCredits() {
    if ("directReplyTo" in this.params || this.params.preSettled) return undefined
    return this.params.initialCredits
  }

  private restoreCredit(credits: number) {
    this.linkNumber++
    this.unsettledCount = 0
    this.settledSinceLastReturn = 0
    this.receiverLink.add_credit(credits)
  }

  private trackDelivery(): (() => void) | undefined {
    const manualCredits = this.manualCredits
    if (!manualCredits) return undefined
    const deliveryLinkNumber = this.linkNumber
    this.unsettledCount++
    let alreadySettled = false
    return () => {
      if (alreadySettled) return
      alreadySettled = true
      this.onMessageSettled(deliveryLinkNumber, manualCredits)
    }
  }

  private onMessageSettled(deliveryLinkNumber: number, credits: number) {
    if (!this.isFromCurrentLink(deliveryLinkNumber)) return
    this.unsettledCount--
    this.settledSinceLastReturn++
    const remaining = remainingCredit(credits, this.unsettledCount, this.settledSinceLastReturn)
    if (!shouldReturnSettledCredits(this.settledSinceLastReturn, remaining)) return
    this.receiverLink.add_credit(this.settledSinceLastReturn)
    this.settledSinceLastReturn = 0
  }

  private isFromCurrentLink(deliveryLinkNumber: number) {
    return deliveryLinkNumber === this.linkNumber && this.receiverLink.is_open()
  }

  close() {
    this.receiverLink.removeAllListeners()
    if (this.receiverLink.is_open()) this.receiverLink.close()
    if (this.consumersList.has(this._id)) this.consumersList.delete(this._id)
  }
}

function validateConsumerPriority(priority?: ConsumerPriority): ConsumerPriority | undefined {
  if (priority === undefined) return undefined
  if (!Number.isInteger(priority) || priority < INT32_MIN || priority > INT32_MAX) {
    throw new Error(`Consumer priority must be a 32-bit signed integer, got ${priority}`)
  }
  return priority
}

function createLinkPropertiesFrom(priority?: ConsumerPriority): Dictionary<Typed> | undefined {
  if (priority === undefined) return undefined
  return { [CONSUMER_PRIORITY_PROPERTY]: types.wrap_int(priority) }
}

function toOffsetFilterValue(offset: Offset): string | Typed {
  const value = offset.toValue()
  if (typeof value === "string") return value
  const buffer = bigintTo64BitBuffer(value)
  return offset.type === OffsetType.timestamp ? types.wrap_timestamp(buffer) : types.wrap_ulong(buffer)
}

export function createConsumerFilterFrom(params: QueueConsumerParams): SourceFilter | undefined {
  if ("queue" in params) {
    return undefined
  }
  if (!params.stream.offset && !params.stream.filterValues) {
    throw new Error("At least one between offset and filterValues must be set when using filtering")
  }

  const filters: Dictionary<string | bigint | boolean | string[] | Typed> = {}
  if (params.stream.offset) {
    filters[STREAM_OFFSET_SPEC] = types.wrap_described(toOffsetFilterValue(params.stream.offset), STREAM_OFFSET_SPEC)
  }
  if (params.stream.filterValues) {
    filters[STREAM_FILTER_SPEC] = types.wrap_described(params.stream.filterValues, STREAM_FILTER_SPEC)
  }
  if (params.stream.sqlFilter) {
    filters[STREAM_FILTER_SQL] = types.wrap_described(params.stream.sqlFilter, 0x120)
  }
  if (params.stream.matchUnfiltered) {
    filters[STREAM_FILTER_MATCH_UNFILTERED] = types.wrap_described(
      params.stream.matchUnfiltered,
      STREAM_FILTER_MATCH_UNFILTERED
    )
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
