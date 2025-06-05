import { Management, AmqpManagement } from "../../src/index.js"
import { afterEach, beforeEach, describe, test } from "vitest"
import { existsQueue } from "../support/util.js"
import { use, expect } from "chai"
import chaiAsPromised from "chai-as-promised"

use(chaiAsPromised)

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
