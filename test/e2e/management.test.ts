import { afterEach, beforeEach, describe, expect, test } from "vitest"
import { AmqpManagement, Management } from "../../src/index.js"
import { existsQueue } from "../support/util.js"

describe.skip("Management", () => {
  let management: Management

  beforeEach(() => {
    management = new AmqpManagement()
  })

  afterEach(() => {
    management.close()
  })

  test("create a queue through the management", async () => {
    const queue = management.queue("test-coda").exclusive(true).autoDelete(true).declare()

    expect(await existsQueue(queue.name)).to.eql(true)
  })
})
