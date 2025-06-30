import { afterEach, beforeEach, describe, expect, test } from "vitest"
import { createEnvironment, Environment } from "../../src/environment.js"
import {
  host,
  port,
  username,
  password,
  createExchange,
  createQueue,
  createBinding,
  cleanRabbit,
  deleteExchange,
  expectToThrowAsync,
  deleteQueue,
} from "../support/util.js"
import { Connection } from "../../src/connection.js"
import { OutcomeState } from "../../src/utils.js"
import { createAmqpMessage } from "../../src/message.js"

describe("Publisher", () => {
  let environment: Environment
  let connection: Connection
  const exchangeName = "test-exchange"
  const exchangeName2 = "test-exchange-2"
  const queueName = "test-queue"
  const queueName2 = "test-queue-2"
  const bindingKey = "test-key"
  const bindingKey2 = "test-key-2"

  beforeEach(async () => {
    environment = createEnvironment({
      host,
      port,
      username,
      password,
    })
    connection = await environment.createConnection()
    await createExchange(exchangeName)
    await createExchange(exchangeName2)
    await createQueue(queueName2)
    await createQueue(queueName)
    await createBinding(bindingKey, { source: exchangeName, destination: queueName, type: "exchangeToQueue" })
    await createBinding(bindingKey2, { source: exchangeName, destination: exchangeName2, type: "exchangeToExchange" })
    await createBinding(bindingKey2, { source: exchangeName2, destination: queueName2, type: "exchangeToQueue" })
  })

  afterEach(async () => {
    await cleanRabbit({ match: /test-/ })
    await connection.close()
    await environment.close()
  })

  test("publish a message to an exchange", async () => {
    const publisher = await connection.createPublisher({ exchange: { name: exchangeName, routingKey: bindingKey } })

    const publishResult = await publisher.publish(createAmqpMessage({ body: "Hello World!" }))

    expect(publishResult.outcome).to.eql(OutcomeState.ACCEPTED)
  })

  test("publish a message to a queue", async () => {
    const publisher = await connection.createPublisher({ queue: { name: queueName } })

    const publishResult = await publisher.publish(createAmqpMessage({ body: "Hello World!" }))

    expect(publishResult.outcome).to.eql(OutcomeState.ACCEPTED)
  })

  test("publish a non routable message", async () => {
    const publisher = await connection.createPublisher({ exchange: { name: exchangeName } })

    const publishResult = await publisher.publish(createAmqpMessage({ body: "Hello World!" }))

    expect(publishResult.outcome).to.eql(OutcomeState.RELEASED)
  })

  test.skip("publish should throw if exchange is deleted", async () => {
    const publisher = await connection.createPublisher({ exchange: { name: exchangeName, routingKey: bindingKey } })
    await deleteExchange(exchangeName)

    await expectToThrowAsync(() => publisher.publish(createAmqpMessage({ body: "Hello World!" })), Error)
    // await expect(publisher.publish(createAmqpMessage({ body: "Hello World!" }))).rejects.toThrowError()
  })

  test.skip("publish should throw if queue is deleted", async () => {
    const publisher = await connection.createPublisher({ queue: { name: queueName } })
    await deleteQueue(queueName)

    await expectToThrowAsync(() => publisher.publish(createAmqpMessage({ body: "Hello World!" })), Error)
    // await expect(publisher.publish(createAmqpMessage({ body: "Hello World!" }))).rejects.toThrowError()
  })

  test("publish a message with address to an exchange", async () => {
    const publisher = await connection.createPublisher()

    const publishResult = await publisher.publish(
      createAmqpMessage({
        body: "Hello World!",
        destination: { exchange: { name: exchangeName, routingKey: bindingKey } },
      })
    )

    expect(publishResult.outcome).to.eql(OutcomeState.ACCEPTED)
  })

  test("publish a message with address to a queue", async () => {
    const publisher = await connection.createPublisher()

    const publishResult = await publisher.publish(
      createAmqpMessage({
        body: "Hello World!",
        destination: { queue: { name: queueName } },
      })
    )

    expect(publishResult.outcome).to.eql(OutcomeState.ACCEPTED)
  })

  test.skip("publish a non routable message with address", async () => {
    const publisher = await connection.createPublisher()

    const publishResult = await publisher.publish(
      createAmqpMessage({
        body: "Hello World!",
        destination: { exchange: { name: exchangeName } },
      })
    )

    expect(publishResult.outcome).to.eql(OutcomeState.RELEASED)
  })
})
