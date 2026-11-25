export type QueueType = "classic" | "stream" | "quorum"

export type QuorumDeadLetterStrategy = "at-most-once" | "at-least-once"

export type ClassicQueueMode = "default" | "lazy"

export type ClassicQueueVersion = 1 | 2

type BaseQueueOptions = {
  exclusive: boolean
  autoDelete: boolean
  arguments: Record<string, string>
}

export type ClassicQueueOptions = BaseQueueOptions & {
  type: "classic"
  durable: boolean
  maxPriority: number
  mode: ClassicQueueMode
  version: ClassicQueueVersion
}

export type QuorumQueueOptions = BaseQueueOptions & {
  type: "quorum"
  durable: true
  deadLetterStrategy: QuorumDeadLetterStrategy
  deliveryLimit: number
  initialGroupSize: number
  targetGroupSize: number
}

export const MAX_STREAM_INITIAL_OFFSET = (1n << 62n) - 1n

export type StreamQueueOptions = BaseQueueOptions & {
  type: "stream"
  durable: true
  maxLengthBytes: number
  maxAge: string
  segmentSize: number
  filterSizeBytes: number
  initialClusterSize: number
  initialOffset: bigint
}

export type QueueOptions = ClassicQueueOptions | QuorumQueueOptions | StreamQueueOptions

export type QueueInfo = {
  name: string
  durable: boolean
  autoDelete: boolean
  exclusive: boolean
  type: QueueType
  leader: string
  replicas: string[]
  messageCount: number
  consumerCount: number
  arguments: Record<string, string>
}

export type DeletedQueueInfo = {
  name: string
  deleted: boolean
}

export interface Queue {
  getInfo: QueueInfo
}

export class AmqpQueue implements Queue {
  constructor(private readonly info: QueueInfo) {}

  public get getInfo(): QueueInfo {
    return this.info
  }
}
