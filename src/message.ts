import { generate_uuid, MessageAnnotations, MessageProperties, Message as RheaMessage } from "rhea"
import { AmqpEndpoints } from "./link_message_builder.js"
import { inspect } from "util"
import { CreateConsumerParams } from "./consumer.js"

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
  annotations?: MessageAnnotations
  properties?: MessageProperties
}

export function createAmqpMessage(options: MessageOptions): RheaMessage {
  if (options.destination) {
    return {
      message_id: generate_uuid(),
      body: options.body,
      to: createPublisherAddressFrom(options.destination),
      durable: true,
      message_annotations: options.annotations,
      application_properties: options.properties,
    }
  }

  return { message_id: generate_uuid(), body: options.body, durable: true, message_annotations: options.annotations, application_properties: options.properties, }
}

export function createPublisherAddressFrom(options?: DestinationOptions): string | undefined {
  if (!options) return undefined
  if ("queue" in options) return `/${AmqpEndpoints.Queues}/${options.queue.name}`
  if ("exchange" in options) {
    return options.exchange.routingKey
      ? `/${AmqpEndpoints.Exchanges}/${options.exchange.name}/${options.exchange.routingKey}`
      : `/${AmqpEndpoints.Exchanges}/${options.exchange.name}`
  }

  throw new Error(`Unknown publisher options -- ${inspect(options)}`)
}

export function createConsumerAddressFrom(params: CreateConsumerParams): string | undefined {
  if ("queue" in params) return `/${AmqpEndpoints.Queues}/${params.queue.name}`
  if ("stream" in params) return `/${AmqpEndpoints.Queues}/${params.stream.name}`

  throw new Error(`Unknown publisher options -- ${inspect(params)}`)
}
