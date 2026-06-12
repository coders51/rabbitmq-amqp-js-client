import { describe, test, expect, vi } from "vitest"
import { EventEmitter } from "events"
import { Connection as RheaConnection, ReceiverEvents, Receiver, Sender } from "rhea"
import { AmqpManagement } from "../../../src/management.js"

function createMocks() {
  const receiverEmitter = new EventEmitter()
  const sentMessages: Array<{ message_id: string }> = []

  const mockSender = {
    send: vi.fn((msg) => {
      sentMessages.push(msg)
      return { id: sentMessages.length }
    }),
    close: vi.fn(),
  }
  const mockReceiver = {
    on: vi.fn((event: string, handler: (...args: unknown[]) => void) => receiverEmitter.on(event, handler)),
    once: vi.fn((event: string, handler: (...args: unknown[]) => void) => receiverEmitter.once(event, handler)),
    close: vi.fn(),
    is_open: vi.fn(() => false),
  }
  const mockConn = { is_closed: vi.fn(() => false) }

  return { receiverEmitter, sentMessages, mockSender, mockReceiver, mockConn }
}

describe("AmqpManagement: concurrent request routing", () => {
  test("single declareQueue resolves when its response arrives", async () => {
    const { receiverEmitter, sentMessages, mockSender, mockReceiver, mockConn } = createMocks()
    const management = new AmqpManagement(
      mockConn as unknown as RheaConnection,
      mockSender as unknown as Sender,
      mockReceiver as unknown as Receiver
    )

    const declareQueuePromise = management.declareQueue("test-queue")
    await new Promise((r) => setImmediate(r))

    const msgId = sentMessages[0].message_id
    receiverEmitter.emit(ReceiverEvents.message, {
      message: {
        subject: "201",
        correlation_id: msgId,
        body: { name: "test-queue", durable: 1, auto_delete: 0, exclusive: 0, type: "classic", arguments: {} },
      },
    })

    const queue = await declareQueuePromise
    expect(queue).toBeDefined()
  })

  test("concurrent refreshToken and declareQueue: each response routed to the correct handler", async () => {
    const { receiverEmitter, sentMessages, mockSender, mockReceiver, mockConn } = createMocks()
    const management = new AmqpManagement(
      mockConn as unknown as RheaConnection,
      mockSender as unknown as Sender,
      mockReceiver as unknown as Receiver
    )

    const tokenRefreshPromise = management.refreshToken("new-oauth-token")
    const declareQueuePromise = management.declareQueue("my-queue")

    await new Promise((r) => setImmediate(r))

    expect(sentMessages).toHaveLength(2)
    const refreshTokenMsgId = sentMessages[0].message_id
    const declareQueueMsgId = sentMessages[1].message_id

    // Deliver declareQueue response first (wrong order — the race)
    receiverEmitter.emit(ReceiverEvents.message, {
      message: {
        subject: "201",
        correlation_id: declareQueueMsgId,
        body: { name: "my-queue", durable: 1, auto_delete: 0, exclusive: 0, type: "classic", arguments: {} },
      },
    })

    // declareQueue should resolve correctly
    const queue = await declareQueuePromise
    expect(queue).toBeDefined()

    // refreshToken must NOT have been rejected by the declareQueue response
    let tokenRejected = false
    tokenRefreshPromise.catch(() => {
      tokenRejected = true
    })
    await new Promise((r) => setTimeout(r, 50))
    expect(tokenRejected).toBe(false)

    // Deliver the refreshToken response — it must still resolve
    receiverEmitter.emit(ReceiverEvents.message, {
      message: {
        subject: "200",
        correlation_id: refreshTokenMsgId,
        body: null,
      },
    })

    const tokenResult = await tokenRefreshPromise
    expect(tokenResult).toBe(true)
  })
})
