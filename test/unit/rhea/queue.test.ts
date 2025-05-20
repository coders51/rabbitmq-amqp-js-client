import { afterEach, beforeEach, describe, test } from "vitest"
import { existsQueue, host, password, port, username, wait } from "../../support/util.js"
import { use, expect } from "chai"
import chaiAsPromised from "chai-as-promised"
import * as rhea from "rhea"

use(chaiAsPromised)

describe("Rhea exploration tests", () => {
  let connection: rhea.Connection

  beforeEach(() => {
    connection = rhea.connect({ port, host, password, username })
  })

  afterEach(() => {
    connection.close()
  })

  test("creates a queue", async () => {
    const queueName = "test-queue"

    connection.open_receiver(queueName)
    connection.open_sender(queueName)

    await wait(1000)
    expect(await existsQueue(queueName)).to.eql(true)
  })
})
