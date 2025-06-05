export interface QueueInfo {
  name: string
}

export class AmqpQueueInfo implements QueueInfo {
  private queueName: string

  constructor(params: { name: string }) {
    this.queueName = params.name
  }

  public get name(): string {
    return this.queueName
  }
}
