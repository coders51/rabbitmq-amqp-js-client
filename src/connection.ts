import { ConnectionEvents, create_container, Connection as RheaConnection } from "rhea"
import { AmqpManagement, Management } from "./management.js"
import { EnvironmentParams } from "./environment.js"
import { AmqpPublisher, Publisher } from "./publisher.js"
import { DestinationOptions } from "./message.js"

export interface Connection {
  close(): Promise<boolean>
  isOpen(): boolean
  management(): Management
  createPublisher(options?: DestinationOptions): Promise<Publisher>
  get publishers(): Map<string, Publisher>
}

export class AmqpConnection implements Connection {
  private _publishers: Map<string, Publisher> = new Map<string, Publisher>()

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

      this._publishers.forEach((p) => p.close())
      this.connection.close()
    })
  }

  management(): Management {
    return this.topologyManagement
  }

  async createPublisher(options?: DestinationOptions): Promise<Publisher> {
    const publisher = await AmqpPublisher.createFrom(this.connection, this._publishers, options)
    this._publishers.set(publisher.id, publisher)
    return publisher
  }

  public get publishers(): Map<string, Publisher> {
    return this._publishers
  }

  public isOpen(): boolean {
    return this.connection ? this.connection.is_open() : false
  }
}
