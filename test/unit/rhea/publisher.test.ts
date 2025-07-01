import { afterEach, beforeEach, describe, expect, test } from "vitest"
import { host, port, username, password, eventually, deleteExchange, deleteQueue } from "../../support/util.js"
import { Connection, Container, create_container, SenderEvents } from "rhea"
import {
  closeConnection,
  openConnection,
  openManagement,
  openPublisherSender,
  RheaManagement,
  sendCreationExchangeMessage,
  sendCreationQueueMessage,
  testExchangeName,
  testQueueName,
} from "../../support/rhea_utils.js"
import { randomUUID } from "crypto"

describe("Creating a publisher through rhea", () => {
  let container: Container
  let connection: Connection
  let management: RheaManagement

  beforeEach(async () => {
    container = create_container()
    connection = await openConnection(container, {
      host,
      port,
      username,
      password,
    })
    management = await openManagement(connection)
    await sendCreationExchangeMessage(connection, management.sender, management.receiver)
    await sendCreationQueueMessage(connection, management.sender, management.receiver)
  })

  afterEach(async () => {
    await deleteExchange(testExchangeName)
    await deleteQueue(testQueueName)
    await closeConnection(connection)
  })

  describe("exchange", () => {
    test("create a publisher", async () => {
      const publisher = await openPublisherSender(connection, `/exchanges/${testExchangeName}`)

      expect(publisher).to.not.eql(null)
    })

    test("send a message through a publisher", async () => {
      const publisher = await openPublisherSender(connection, `/exchanges/${testExchangeName}`)
      let test = false
      publisher.on(SenderEvents.accepted, () => {
        console.log("accepted")
        test = true
      })
      publisher.on(SenderEvents.sendable, () => {
        console.log("sendable")
        test = true
      })
      publisher.on(SenderEvents.modified, () => {
        console.log("modified")
        test = true
      })
      publisher.on(SenderEvents.rejected, () => {
        console.log("rejected")
        test = true
      })
      publisher.on(SenderEvents.released, () => {
        console.log("released")
        test = true
      })
      publisher.on(SenderEvents.settled, () => {
        console.log("settled")
        test = true
      })

      publisher.send({ message_id: randomUUID(), body: "Hello world!" })

      await eventually(async () => {
        expect(test).eql(true)
      })
    })
  })

  describe("queue", () => {
    test("create a publisher", async () => {
      const publisher = await openPublisherSender(connection, `/queues/${testQueueName}`)

      expect(publisher).to.not.eql(null)
    })

    test("send a message through a publisher", async () => {
      const publisher = await openPublisherSender(connection, `/queues/${testQueueName}`)
      let test = false
      publisher.on(SenderEvents.accepted, () => {
        console.log("accepted")
        test = true
      })
      publisher.on(SenderEvents.sendable, () => {
        console.log("sendable")
        test = true
      })
      publisher.on(SenderEvents.modified, () => {
        console.log("modified")
        test = true
      })
      publisher.on(SenderEvents.rejected, () => {
        console.log("rejected")
        test = true
      })
      publisher.on(SenderEvents.released, () => {
        console.log("released")
        test = true
      })
      publisher.on(SenderEvents.settled, () => {
        console.log("settled")
        test = true
      })

      publisher.send({ message_id: randomUUID(), body: "Hello world!" })

      await eventually(async () => {
        expect(test).eql(true)
      })
    })
  })

  describe("anonymous", () => {
    test("create a publisher", async () => {
      const publisher = await openPublisherSender(connection)

      expect(publisher).to.not.eql(null)
    })

    test("send a message through a publisher", async () => {
      const publisher = await openPublisherSender(connection)
      let test = false
      publisher.on(SenderEvents.accepted, () => {
        console.log("accepted")
        test = true
      })
      publisher.on(SenderEvents.sendable, () => {
        console.log("sendable")
        test = true
      })
      publisher.on(SenderEvents.modified, () => {
        console.log("modified")
        test = true
      })
      publisher.on(SenderEvents.rejected, () => {
        console.log("rejected")
        test = true
      })
      publisher.on(SenderEvents.released, () => {
        console.log("released")
        test = true
      })
      publisher.on(SenderEvents.settled, () => {
        console.log("settled")
        test = true
      })

      publisher.send({ message_id: randomUUID(), body: "Hello world!", to: `/queues/${testQueueName}` })

      await eventually(async () => {
        expect(test).eql(true)
      })
    })
  })
})
