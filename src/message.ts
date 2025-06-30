import { generate_uuid, Message as RheaMessage } from "rhea"
import { AmqpEndpoints } from "./link_message_builder.js"
import { inspect } from "util"

export type ExchangeOptions = {
  name: string
  routingKey?: string
}

export type QueueOptions = {
  name: string
}

export type DestinationOptions = { exchange: ExchangeOptions } | { queue: QueueOptions }

type MessageOptions = {
  body: string
  destination?: DestinationOptions
}

export function createAmqpMessage(options: MessageOptions): RheaMessage {
  if (options.destination) {
    return { message_id: generate_uuid(), body: options.body, to: createAddressFrom(options.destination) }
  }

  return { message_id: generate_uuid(), body: options.body }
}

export function createAddressFrom(options?: DestinationOptions): string {
  if (!options) return ""
  if ("queue" in options) return `/${AmqpEndpoints.Queues}/${options.queue.name}`
  if ("exchange" in options) {
    return options.exchange.routingKey
      ? `/${AmqpEndpoints.Exchanges}/${options.exchange.name}/${options.exchange.routingKey}`
      : `/${AmqpEndpoints.Exchanges}/${options.exchange.name}`
  }

  throw new Error(`Unknown publisher options -- ${inspect(options)}`)
}
