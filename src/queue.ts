export type QueueType = "classic" | "stream" | "quorum"

export type QueueOptions = {
  type: QueueType
  exclusive: boolean
  autoDelete: boolean
  durable: boolean
  arguments: Record<string, string>
}

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
