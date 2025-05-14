import { expect } from "chai"
import { afterEach, beforeEach, describe, test } from "vitest"
import { existsQueue } from "../support/util.js"

describe("Management", () => {
  let management: Management

  beforeEach(() => {
    management = new Management()
  })

  afterEach(() => {
    management.close()
  })

  test("create a queue through the management", async () => {
    const queue = management.queue("test-coda").exclusive(true).autoDelete(true).declare()

    expect(existsQueue(queue.name)).to.eventually.eql(true)
  })
})
