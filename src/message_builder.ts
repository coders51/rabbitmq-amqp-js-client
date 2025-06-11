import { generate_uuid, Message } from "rhea"

export enum AmqpMethods {
  PUT = "PUT",
  DELETE = "DELETE",
  GET = "GET",
}

export enum AmqpEndpoints {
  Queues = "queues",
}

export const ME = "$me"

export class MessageBuilder {
  private messageId: string = generate_uuid()
  private to: string = ""
  private replyTo: string = ME
  private method: AmqpMethods = AmqpMethods.GET
  private body: unknown

  constructor() {}

  setMessageId(id: string) {
    this.messageId = id
    return this
  }

  sendTo(to: string) {
    this.to = to
    return this
  }

  setReplyTo(replyTo: string) {
    this.replyTo = replyTo
    return this
  }

  setAmqpMethod(method: AmqpMethods) {
    this.method = method
    return this
  }

  setBody(body: unknown) {
    this.body = body
    return this
  }

  build(): Message {
    return {
      message_id: this.messageId,
      to: this.to,
      reply_to: this.replyTo,
      subject: this.method,
      body: this.body,
    }
  }
}
