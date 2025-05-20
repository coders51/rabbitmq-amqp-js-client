import { AmqpQueueSpec, QueueSpec } from "./queue.js"

export interface Management {
  queue: (queueName: string) => QueueSpec
  close: () => void
}

export class AmqpManagement implements Management {
  constructor() {}

  close() {}

  queue(queueName: string): QueueSpec {
    return new AmqpQueueSpec().name(queueName)
  }
}
