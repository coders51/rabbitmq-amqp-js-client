import { describe, expect, test } from "vitest"
import { Typed } from "rhea"
import { buildDeclareQueueBody, checkStreamQueueOptions } from "../../src/management.js"
import { MAX_STREAM_INITIAL_OFFSET } from "../../src/queue.js"

describe("Stream queue options", () => {
  describe("declare arguments", () => {
    test("maps every stream option to its queue argument", () => {
      const body = buildDeclareQueueBody({
        type: "stream",
        maxLengthBytes: 10_000_000_000,
        maxAge: "7D",
        segmentSize: 50_000_000,
        filterSizeBytes: 32,
        initialClusterSize: 3,
      })

      expect(body.arguments).toEqual({
        "x-queue-type": "stream",
        "x-max-length-bytes": 10_000_000_000,
        "x-max-age": "7D",
        "x-stream-max-segment-size-bytes": 50_000_000,
        "x-stream-filter-size-bytes": 32,
        "x-stream-initial-cluster-size": 3,
      })
    })

    test("sends only the queue type when no stream option is set", () => {
      const body = buildDeclareQueueBody({ type: "stream" })

      expect(body.arguments).toEqual({ "x-queue-type": "stream" })
    })

    test("encodes the initial offset as an AMQP long", () => {
      const body = buildDeclareQueueBody({ type: "stream", initialOffset: 1000n })

      const argument = body.arguments["x-stream-initial-offset"] as Typed
      expect(argument.type.name).toBe("Long")
      expect(Buffer.from(argument.value).readBigInt64BE()).toBe(1000n)
    })

    test("does not send the initial offset when it is 0", () => {
      const body = buildDeclareQueueBody({ type: "stream", initialOffset: 0n })

      expect(body.arguments).toEqual({ "x-queue-type": "stream" })
    })

    test("encodes the maximum initial offset without losing precision", () => {
      const body = buildDeclareQueueBody({ type: "stream", initialOffset: MAX_STREAM_INITIAL_OFFSET })

      const argument = body.arguments["x-stream-initial-offset"] as Typed
      expect(Buffer.from(argument.value).readBigInt64BE()).toBe(MAX_STREAM_INITIAL_OFFSET)
    })
  })

  describe("initial offset validation", () => {
    const broker44 = { version: "4.4.1" }
    const broker43 = { version: "4.3.7" }

    test.each([0n, 1n, MAX_STREAM_INITIAL_OFFSET])("accepts %d", (initialOffset) => {
      expect(() => checkStreamQueueOptions({ type: "stream", initialOffset }, broker44)).not.toThrow()
    })

    test.each([-1n, MAX_STREAM_INITIAL_OFFSET + 1n])("rejects %d", (initialOffset) => {
      expect(() => checkStreamQueueOptions({ type: "stream", initialOffset }, broker44)).toThrowError(
        `Stream initial offset must be between 0 and ${MAX_STREAM_INITIAL_OFFSET}, given: ${initialOffset}`
      )
    })

    test("rejects the initial offset on RabbitMQ before 4.4", () => {
      expect(() => checkStreamQueueOptions({ type: "stream", initialOffset: 1000n }, broker43)).toThrowError(
        "Stream initial offset is not supported by this broker. RabbitMQ 4.4 or later is required."
      )
    })

    test("accepts the other stream options on RabbitMQ before 4.4", () => {
      expect(() => checkStreamQueueOptions({ type: "stream", maxAge: "7D" }, broker43)).not.toThrow()
    })
  })
})
