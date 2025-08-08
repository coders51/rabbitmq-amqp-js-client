import { Message } from "rhea"
import { AUTO_DELETE, DURABLE, EXCLUSIVE, isError, queueTypeFromString, Result } from "./utils.js"
import { DeletedQueueInfo, QueueInfo } from "./queue.js"

interface ResponseDecoder {
  decodeFrom: (receivedMessage: Message, sentMessageId: string) => Result<unknown, Error>
}

export class CreateQueueResponseDecoder implements ResponseDecoder {
  decodeFrom(receivedMessage: Message, sentMessageId: string): Result<QueueInfo, Error> {
    if (isError(receivedMessage) || sentMessageId !== receivedMessage.correlation_id) {
      return {
        status: "error",
        error: new Error(`Message Error: ${receivedMessage.subject}; ${receivedMessage.body}`),
      }
    }

    return {
      status: "ok",
      body: {
        name: receivedMessage.body.name,
        durable: receivedMessage.body.durable === DURABLE,
        autoDelete: receivedMessage.body.auto_delete === AUTO_DELETE,
        exclusive: receivedMessage.body.exclusive === EXCLUSIVE,
        type: queueTypeFromString(receivedMessage.body.type),
        arguments: receivedMessage.body.arguments ?? {},
        leader: receivedMessage.body.leader,
        replicas: receivedMessage.body.replicas,
        messageCount: receivedMessage.body.message_count,
        consumerCount: receivedMessage.body.consumer_count,
      },
    }
  }
}

export class GetQueueInfoResponseDecoder extends CreateQueueResponseDecoder {}

export class DeleteQueueResponseDecoder implements ResponseDecoder {
  decodeFrom(receivedMessage: Message, sentMessageId: string): Result<DeletedQueueInfo, Error> {
    if (isError(receivedMessage) || sentMessageId !== receivedMessage.correlation_id) {
      return { status: "error", error: new Error(`Message Error: ${receivedMessage.subject}`) }
    }

    return {
      status: "ok",
      body: {
        name: receivedMessage.body.name,
        deleted: true,
      },
    }
  }
}

class EmptyBodyResponseDecoder implements ResponseDecoder {
  decodeFrom(receivedMessage: Message, sentMessageId: string): Result<void, Error> {
    if (isError(receivedMessage) || sentMessageId !== receivedMessage.correlation_id) {
      return { status: "error", error: new Error(`Message Error: ${receivedMessage.subject}`) }
    }

    return {
      status: "ok",
      body: undefined,
    }
  }
}

export class CreateExchangeResponseDecoder extends EmptyBodyResponseDecoder {}

export class DeleteExchangeResponseDecoder extends EmptyBodyResponseDecoder {}

export class CreateBindingResponseDecoder extends EmptyBodyResponseDecoder {}

export class DeleteBindingResponseDecoder extends EmptyBodyResponseDecoder {}

export class RefreshTokensResponseDecoder extends EmptyBodyResponseDecoder {}
