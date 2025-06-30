import {
  Connection,
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
