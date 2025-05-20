export interface QueueInfo {
  name: string
}

export class AmqpQueueInfo implements QueueInfo {
  private queueName: string

  constructor(params: { name: string; exclusive: boolean; autoDelete: boolean }) {
    this.queueName = params.name
  }

  public get name(): string {
    return this.queueName
  }
}

export interface QueueSpec {
  name: (queueName: string) => QueueSpec
  exclusive: (isExclusive: boolean) => QueueSpec
  autoDelete: (isAutoDelete: boolean) => QueueSpec
  declare: () => QueueInfo
}

export class AmqpQueueSpec implements QueueSpec {
  private queueName: string
  private isExclusive: boolean
  private isAutoDelete: boolean

  constructor() {
    this.queueName = "default-queue-name"
    this.isExclusive = false
    this.isAutoDelete = false
  }

  name(queueName: string): QueueSpec {
    this.queueName = queueName
    return this
  }

  exclusive(isExclusive: boolean): QueueSpec {
    this.isExclusive = isExclusive
    return this
  }

  autoDelete(isAutoDelete: boolean): QueueSpec {
    this.isAutoDelete = isAutoDelete
    return this
  }

  declare(): QueueInfo {
    return new AmqpQueueInfo({ name: this.queueName, exclusive: this.isExclusive, autoDelete: this.isAutoDelete })
  }
}
