import { AmqpManagement } from "./management.js"
import { createEnvironment, AmqpEnvironment } from "./environment.js"
import { AmqpConnection } from "./connection.js"
import { AmqpPublisher } from "./publisher.js"
import { AmqpConsumer } from "./consumer.js"
import { createAmqpMessage } from "./message.js"
import { OutcomeState, Offset, OffsetType } from "./utils.js"

import type { Management } from "./management.js"
import type { Environment } from "./environment.js"
import type { Connection } from "./connection.js"
import type { Publisher } from "./publisher.js"
import type { Consumer } from "./consumer.js"

declare global {
  interface Window {
    AmqpManagement: typeof AmqpManagement
    createEnvironment: typeof createEnvironment
    AmqpEnvironment: typeof AmqpEnvironment
    AmqpConnection: typeof AmqpConnection
    AmqpPublisher: typeof AmqpPublisher
    AmqpConsumer: typeof AmqpConsumer
    createAmqpMessage: typeof createAmqpMessage
    OutcomeState: typeof OutcomeState
    Offset: typeof Offset
    OffsetType: typeof OffsetType
  }

  interface GlobalThis {
    AmqpManagement: typeof AmqpManagement
    createEnvironment: typeof createEnvironment
    AmqpEnvironment: typeof AmqpEnvironment
    AmqpConnection: typeof AmqpConnection
    AmqpPublisher: typeof AmqpPublisher
    AmqpConsumer: typeof AmqpConsumer
    createAmqpMessage: typeof createAmqpMessage
    OutcomeState: typeof OutcomeState
    Offset: typeof Offset
    OffsetType: typeof OffsetType
  }

  const AmqpManagement: typeof import("./management.js").AmqpManagement
  const createEnvironment: typeof import("./environment.js").createEnvironment
  const AmqpEnvironment: typeof import("./environment.js").AmqpEnvironment
  const AmqpConnection: typeof import("./connection.js").AmqpConnection
  const AmqpPublisher: typeof import("./publisher.js").AmqpPublisher
  const AmqpConsumer: typeof import("./consumer.js").AmqpConsumer
  const createAmqpMessage: typeof import("./message.js").createAmqpMessage
  const OutcomeState: typeof import("./utils.js").OutcomeState
  const Offset: typeof import("./utils.js").Offset
  const OffsetType: typeof import("./utils.js").OffsetType
}

if (typeof globalThis !== "undefined") {
  const global = globalThis as unknown as GlobalThis
  global.AmqpManagement = AmqpManagement
  global.createEnvironment = createEnvironment
  global.AmqpEnvironment = AmqpEnvironment
  global.AmqpConnection = AmqpConnection
  global.AmqpPublisher = AmqpPublisher
  global.AmqpConsumer = AmqpConsumer
  global.createAmqpMessage = createAmqpMessage
  global.OutcomeState = OutcomeState
  global.Offset = Offset
  global.OffsetType = OffsetType
} else if (typeof (globalThis as { window?: Window }).window !== "undefined") {
  const win = (globalThis as unknown as { window: Window }).window
  win.AmqpManagement = AmqpManagement
  win.createEnvironment = createEnvironment
  win.AmqpEnvironment = AmqpEnvironment
  win.AmqpConnection = AmqpConnection
  win.AmqpPublisher = AmqpPublisher
  win.AmqpConsumer = AmqpConsumer
  win.createAmqpMessage = createAmqpMessage
  win.OutcomeState = OutcomeState
  win.Offset = Offset
  win.OffsetType = OffsetType
}

export {
  AmqpManagement,
  AmqpEnvironment,
  AmqpConnection,
  AmqpPublisher,
  AmqpConsumer,
  createEnvironment,
  createAmqpMessage,
  OutcomeState,
  Offset,
  OffsetType,
}

export type { Management, Environment, Connection, Publisher, Consumer }
