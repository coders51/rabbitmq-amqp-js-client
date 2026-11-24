import { describe, expect, test } from "vitest"
import { Typed, types } from "rhea"
import { createConsumerFilterFrom } from "../../src/consumer.js"
import { Offset, STREAM_OFFSET_SPEC } from "../../src/utils.js"

// rhea exposes its AMQP encoder and decoder at runtime, but its typings leave them out
const codec = types as unknown as {
  Writer: new () => { write(value: Typed): void; toBuffer(): Buffer }
  Reader: new (buffer: Buffer) => { read(): Typed }
}

function encodeAndDecodeOffsetFilter(offset: Offset): Typed {
  const filter = createConsumerFilterFrom({ stream: { name: "s", offset }, messageHandler: () => {} })
  const writer = new codec.Writer()
  writer.write(filter![STREAM_OFFSET_SPEC] as Typed)
  return new codec.Reader(writer.toBuffer()).read()
}

function toBigInt(value: number | Buffer): bigint {
  return Buffer.isBuffer(value) ? value.readBigUInt64BE() : BigInt(value)
}

describe("Stream offset", () => {
  test.each([0n, 5n])("Offset.offset(%s).toValue() returns the number", (value) => {
    expect(Offset.offset(value).toValue()).toBe(value)
  })

  test.each([0n, 5n, 1000n, 2n ** 62n - 1n])("a numeric offset %s is sent as an AMQP ulong", (value) => {
    const decoded = encodeAndDecodeOffsetFilter(Offset.offset(value))

    expect(decoded.descriptor.value).toBe(STREAM_OFFSET_SPEC)
    expect(decoded.type.name).toMatch(/^(Ulong0|SmallUlong|Ulong)$/)
    expect(toBigInt(decoded.value)).toBe(value)
  })

  test("a negative numeric offset is rejected", () => {
    expect(() => Offset.offset(-1n)).toThrow("Offset must not be negative")
  })

  test("a timestamp offset is sent as an AMQP timestamp in milliseconds", () => {
    const date = new Date("2026-11-19T10:00:00.000Z")

    const decoded = encodeAndDecodeOffsetFilter(Offset.timestamp(date))

    expect(decoded.descriptor.value).toBe(STREAM_OFFSET_SPEC)
    expect(decoded.type.name).toBe("Timestamp")
    expect(toBigInt(decoded.value)).toBe(BigInt(date.getTime()))
  })

  test.each([Offset.first(), Offset.last(), Offset.next()])("a named offset is sent as a string", (offset) => {
    const decoded = encodeAndDecodeOffsetFilter(offset)

    expect(decoded.value).toBe(offset.type.toString())
  })
})
