import { Message } from "rhea"
import { AUTO_DELETE, DURABLE, EXCLUSIVE, isError, queueTypeFromString, Result } from "./utils.js"
import { DeletedQueueInfo, QueueInfo } from "./queue.js"

export interface ResponseDecoder<T> {
  decodeFrom: (receivedMessage: Message, sentMessageId: string) => Result<T, Error>
}

function validateResponse(receivedMessage: Message, sentMessageId: string): Error | null {
  if (isError(receivedMessage)) {
    return new Error(`Message Error: ${receivedMessage.subject} ${JSON.stringify(receivedMessage.body)}`)
  }
  if (String(sentMessageId) !== String(receivedMessage.correlation_id)) {
    return new Error(`Correlation mismatch: sent ${sentMessageId}, received ${receivedMessage.correlation_id}`)
  }
  return null
}

export class CreateQueueResponseDecoder implements ResponseDecoder<QueueInfo> {
  decodeFrom(receivedMessage: Message, sentMessageId: string): Result<QueueInfo, Error> {
    const error = validateResponse(receivedMessage, sentMessageId)
    if (error) return { status: "error", error }

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

export class DeleteQueueResponseDecoder implements ResponseDecoder<DeletedQueueInfo> {
  decodeFrom(receivedMessage: Message, sentMessageId: string): Result<DeletedQueueInfo, Error> {
    const error = validateResponse(receivedMessage, sentMessageId)
    if (error) return { status: "error", error }

    return {
      status: "ok",
      body: {
        name: receivedMessage.body.name,
        deleted: true,
      },
    }
  }
}

class EmptyBodyResponseDecoder implements ResponseDecoder<void> {
  decodeFrom(receivedMessage: Message, sentMessageId: string): Result<void, Error> {
    const error = validateResponse(receivedMessage, sentMessageId)
    if (error) return { status: "error", error }

    return { status: "ok", body: undefined }
  }
}

export class CreateExchangeResponseDecoder extends EmptyBodyResponseDecoder {}

export class DeleteExchangeResponseDecoder extends EmptyBodyResponseDecoder {}

export class CreateBindingResponseDecoder extends EmptyBodyResponseDecoder {}

export class DeleteBindingResponseDecoder extends EmptyBodyResponseDecoder {}

export class RefreshTokensResponseDecoder extends EmptyBodyResponseDecoder {}
