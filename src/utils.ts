import { Dictionary, Message, Typed } from "rhea"
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

export const STREAM_OFFSET_SPEC = "rabbitmq:stream-offset-spec"
export const STREAM_FILTER_SPEC = "rabbitmq:stream-filter"
export const STREAM_FILTER_MATCH_UNFILTERED = "rabbitmq:stream-match-unfiltered"
export const STREAM_FILTER_MESSAGE_PROPERTIES = "properties-filter"
export const STREAM_FILTER_APPLICATION_PROPERTIES = "application-properties-filter"
export const STREAM_FILTER_SQL = "sql-filter"

export type SourceFilter = Dictionary<string | bigint | boolean | string[] | Typed>

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

export function isBrokerVersionAtLeast(
  properties: { [x: string]: unknown } | undefined,
  major: number,
  minor: number
): boolean {
  const version = properties?.version
  if (typeof version !== "string") return false
  const [maj, min] = version.split(".").map(Number)
  return maj > major || (maj === major && min >= minor)
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

// https://github.com/amqp/rhea/blob/3.0.4/lib/types.js#L356
// Written as two 32-bit halves because the browser Buffer polyfill has no writeBigUInt64BE.
export function bigintTo64BitBuffer(value: bigint): Buffer {
  const unsigned = BigInt.asUintN(64, value)
  const buffer = Buffer.alloc(8)
  buffer.writeUInt32BE(Number(unsigned >> 32n), 0)
  buffer.writeUInt32BE(Number(unsigned & 0xffffffffn), 4)
  return buffer
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

  toValue(): string | bigint {
    switch (this.type) {
      case OffsetType.first:
      case OffsetType.last:
      case OffsetType.next:
        return this.type
      case OffsetType.numeric:
      case OffsetType.timestamp:
        if (this.value == null) throw new Error(`Offset of type ${this.type} needs a value`)
        return this.value
      default:
        throw new Error(`Unsupported offset type: ${this.type}`)
    }
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
    if (offset < 0n) throw new Error("Offset must not be negative")
    return new Offset(OffsetType.numeric, offset)
  }

  static timestamp(date: Date) {
    return new Offset(OffsetType.timestamp, BigInt(date.getTime()))
  }
}
