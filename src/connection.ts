import { ConnectionEvents, create_container, Connection as RheaConnection } from "rhea"
import { AmqpManagement, Management } from "./management.js"
import { EnvironmentParams } from "./environment.js"

export interface Connection {
  close(): Promise<boolean>
  isOpen(): boolean
  management(): Management
}

export class AmqpConnection implements Connection {
  static async create(params: EnvironmentParams) {
    const connection = await AmqpConnection.open(params)
    const topologyManagement = await AmqpManagement.create(connection)
    return new AmqpConnection(connection, topologyManagement)
  }

  private static async open(params: EnvironmentParams): Promise<RheaConnection> {
    return new Promise((res, rej) => {
      const container = create_container()
      container.once(ConnectionEvents.connectionOpen, (context) => {
        return res(context.connection)
      })
      container.once(ConnectionEvents.error, (context) => {
        return rej(context.error ?? new Error("Connection error occurred"))
      })

      container.connect(params)
    })
  }

  constructor(
    private readonly connection: RheaConnection,
    private readonly topologyManagement: Management
  ) {}

  async close(): Promise<boolean> {
    return new Promise((res, rej) => {
      this.connection.once(ConnectionEvents.connectionClose, () => {
        return res(true)
      })
      this.connection.once(ConnectionEvents.connectionError, (context) => {
        return rej(new Error("Connection error: " + context.connection.error))
      })

      this.connection.close()
    })
  }

  management(): Management {
    return this.topologyManagement
  }

  public isOpen(): boolean {
    return this.connection ? this.connection.is_open() : false
  }
}
