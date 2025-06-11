import { Message } from "rhea"
import { QueueType } from "./queue.js"

export enum AmqpResponseCodes {
  OK = "200",
  CREATED = "201",
  NO_CONTENT = "204",
  BAD_REQUEST = "400",
  NOT_FOUND = "404",
  CONFLICT = "409",
}

export const DURABLE = 1
export const AUTO_DELETE = 1
export const EXCLUSIVE = 1

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
