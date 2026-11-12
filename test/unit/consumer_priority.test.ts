import { describe, expect, test } from "vitest"
import { Typed } from "rhea"
import { getConsumerReceiverLinkConfigurationFrom } from "../../src/consumer.js"
import { BrokerFeatures, checkConsumerFeaturesSupported } from "../../src/connection.js"

describe("Consumer priority", () => {
  describe("receiver link configuration", () => {
    test("maps the priority to the rabbitmq:priority link property as an AMQP int", () => {
      const options = getConsumerReceiverLinkConfigurationFrom("/queues/q", "id", false, undefined, 5)

      const property = options.properties?.["rabbitmq:priority"] as Typed
      expect(property.type.name).toBe("SmallInt")
      expect(property.value).toBe(5)
    })

    test("uses a 4-byte int for values outside the small int range", () => {
      const options = getConsumerReceiverLinkConfigurationFrom("/queues/q", "id", false, undefined, 1000)

      const property = options.properties?.["rabbitmq:priority"] as Typed
      expect(property.type.name).toBe("Int")
      expect(property.value).toBe(1000)
    })

    test.each([0, -3])("sends the property also when the priority is %d", (priority) => {
      const options = getConsumerReceiverLinkConfigurationFrom("/queues/q", "id", false, undefined, priority)

      const property = options.properties?.["rabbitmq:priority"] as Typed
      expect(property.value).toBe(priority)
    })

    test("does not send any link property when the priority is not set", () => {
      const options = getConsumerReceiverLinkConfigurationFrom("/queues/q", "id", false)

      expect(options.properties).toBeUndefined()
    })
  })

  describe("broker version check", () => {
    const messageHandler = () => {}
    const before43: BrokerFeatures = { directReplyTo: true, consumerPriority: false }
    const from43: BrokerFeatures = { directReplyTo: true, consumerPriority: true }

    test("rejects a priority on a broker older than 4.3", () => {
      expect(() =>
        checkConsumerFeaturesSupported({ queue: { name: "q" }, priority: 10, messageHandler }, before43)
      ).toThrow(/4\.3/)
    })

    test("rejects a priority 0 too on a broker older than 4.3", () => {
      expect(() =>
        checkConsumerFeaturesSupported({ queue: { name: "q" }, priority: 0, messageHandler }, before43)
      ).toThrow(/4\.3/)
    })

    test("accepts a priority on a broker 4.3 or later", () => {
      expect(() =>
        checkConsumerFeaturesSupported({ queue: { name: "q" }, priority: 10, messageHandler }, from43)
      ).not.toThrow()
    })

    test("accepts a consumer without priority on a broker older than 4.3", () => {
      expect(() => checkConsumerFeaturesSupported({ queue: { name: "q" }, messageHandler }, before43)).not.toThrow()
    })
  })
})
