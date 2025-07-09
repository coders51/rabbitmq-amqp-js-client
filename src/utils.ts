import {
  Connection,
  Dictionary,
  Message,
  Receiver,
  ReceiverEvents,
  ReceiverOptions,
  Sender,
  SenderEvents,
  SenderOptions,
} from "rhea"
import { QueueType } from "./queue.js"

export enum AmqpResponseCodes {
  OK = "200",
  CREATED = "201",
  NO_CONTENT = "204",
  BAD_REQUEST = "400",
  NOT_FOUND = "404",
  CONFLICT = "409",
}

export enum OutcomeState {
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
  RELEASED = "RELEASED",
}

export const DURABLE = 1
export const AUTO_DELETE = 1
export const EXCLUSIVE = 1

export const STREAM_FILTER_SPEC = "rabbitmq:stream-filter"
export const STREAM_OFFSET_SPEC = "rabbitmq:stream-offset-spec"
export const STREAM_FILTER_MATCH_UNFILTERED = "rabbitmq:stream-match-unfiltered"

export type SourceFilter = Dictionary<string | bigint | boolean | string[]>

export type Result<T, K> = OkResult<T> | ErrorResult<K>

type OkResult<T> = {
  status: "ok"
  body: T
}

type ErrorResult<K> = {
  status: "error"
  error: K
}

export function isError(message: Message): boolean {
  return (
    message.subject === AmqpResponseCodes.BAD_REQUEST ||
    message.subject === AmqpResponseCodes.NOT_FOUND ||
    message.subject === AmqpResponseCodes.CONFLICT
  )
}

export function queueTypeFromString(queueType: string): QueueType {
  switch (queueType) {
    case "classic":
      return "classic"
    case "quorum":
      return "quorum"
    case "stream":
      return "stream"
    default:
      throw new Error(`Unsupported queue type: ${queueType}`)
  }
}

type LinkOpenEvents = SenderEvents.senderOpen | ReceiverEvents.receiverOpen
type LinkErrorEvents = SenderEvents.senderError | ReceiverEvents.receiverError
type OpenLinkMethods =
  | ((options?: SenderOptions | string) => Sender)
  | ((options?: ReceiverOptions | string) => Receiver)

export async function openLink<T extends Sender | Receiver>(
  connection: Connection,
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

export enum OffsetType {
  first = "first",
  last = "last",
  next = "next",
  numeric = "numeric",
  timestamp = "timestamp",
}

export class Offset {
  private constructor(
    public readonly type: OffsetType,
    public readonly value?: bigint
  ) {}

  toValue() {
    if (this.value && (this.type === OffsetType.numeric || this.type === OffsetType.timestamp)) return this.value
    return this.type.toString()
  }

  static first() {
    return new Offset(OffsetType.first)
  }

  static last() {
    return new Offset(OffsetType.last)
  }

  static next() {
    return new Offset(OffsetType.next)
  }

  static offset(offset: bigint) {
    return new Offset(OffsetType.numeric, offset)
  }

  static timestamp(date: Date) {
    return new Offset(OffsetType.timestamp, BigInt(date.getTime()))
  }
}
