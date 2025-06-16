import { afterAll, beforeAll, describe, test } from "vitest"
import { host, port, username, password } from "../../support/util.js"
import { Connection, Container, create_container, Receiver, Sender, SenderEvents } from "rhea"
import { closeConnection, openConnection, openManagement, RheaManagement } from "../../support/rhea_utils.js"

describe("Rhea queues", () => {
  let container: Container
  let connection: Connection
  let management: RheaManagement

  beforeAll(async () => {
    container = create_container()
    connection = await openConnection(container, {
      host,
      port,
      username,
      password,
    })
    management = await openManagement(connection)
  })

  afterAll(async () => {
    await closeConnection(connection)
  })

  test("create a queue", async () => {
    await sendCreationQueueMessage(connection, management.sender, management.receiver)

    console.log("All ok")
  })
})

let sent = 0

async function sendCreationQueueMessage(connection: Connection, sender: Sender, receiver: Receiver) {
  console.log("hello")

  return new Promise((res, rej) => {
    connection.once(SenderEvents.sendable, function (context) {
      sent++
      console.log("sent " + sent, context.sender)
      return res(true)
    })
    connection.once(SenderEvents.accepted, function (context) {
      console.log("all messages confirmed", context.sender)
      return res(true)
    })
    receiver.once("message", function (context) {
      console.log("inside receiver message", context.message)
      return res(true)
    })
    connection.once(SenderEvents.rejected, function (context) {
      console.log("Rejected")
      return rej(context.sender.error)
    })
    connection.once(SenderEvents.released, function (context) {
      console.log("Released")
      return rej(context.sender.error)
    })
    connection.once(SenderEvents.modified, function (context) {
      console.log("Modified")
      return rej(context.sender.error)
    })
    connection.once(SenderEvents.senderError, function (context) {
      console.log("SenderError")
      return rej(context.sender.error)
    })
    connection.once(SenderEvents.settled, function (context) {
      console.log("Settled")
      return rej(context.sender.error)
    })

    sender.send({
      message_id: sent,
      to: `/queues/${encodeURIComponent("test-coda")}`,
      reply_to: "$me",
      subject: "PUT",
      body: { durable: true, exclusive: true, auto_delete: true, arguments: {} },
    })
  })
}
