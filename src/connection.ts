import { ConnectionEvents, ConnectionOptions, create_container, Connection as RheaConnection } from "rhea"
import { AmqpManagement, Management } from "./management.js"
import { EnvironmentParams } from "./environment.js"
import { AmqpPublisher, Publisher } from "./publisher.js"
import { DestinationOptions } from "./message.js"
import { AmqpConsumer, Consumer, CreateConsumerParams } from "./consumer.js"

export interface Connection {
  close(): Promise<boolean>
  isOpen(): boolean
  management(): Management
  createPublisher(options?: DestinationOptions): Promise<Publisher>
  get publishers(): Map<string, Publisher>
  get consumers(): Map<string, Consumer>
  createConsumer(params: CreateConsumerParams): Promise<Consumer>
}

export type ConnectionParams =
  | { reconnect: false }
  | {
      reconnect: true | number
      initialReconnectDelay?: number
      maxReconnectDelay?: number
      reconnectLimit?: number
    }

export class AmqpConnection implements Connection {
  private _publishers: Map<string, Publisher> = new Map<string, Publisher>()
  private _consumers: Map<string, Consumer> = new Map<string, Consumer>()

  static async create(envParams: EnvironmentParams, connParams?: ConnectionParams) {
    const connection = await AmqpConnection.open(envParams, connParams)
    const topologyManagement = await AmqpManagement.create(connection)
    return new AmqpConnection(connection, topologyManagement)
  }

  private static async open(envParams: EnvironmentParams, connParams?: ConnectionParams): Promise<RheaConnection> {
    return new Promise((res, rej) => {
      const container = create_container()
      container.once(ConnectionEvents.connectionOpen, (context) => {
        return res(context.connection)
      })
      container.once(ConnectionEvents.error, (context) => {
        return rej(context.error ?? new Error("Connection error occurred"))
      })

      container.connect(buildConnectParams(envParams, connParams))
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
      this._consumers.forEach((p) => p.close())
      this.connection.close()
    })
  }

  async createConsumer(params: CreateConsumerParams): Promise<Consumer> {
    const consumer = await AmqpConsumer.createFrom(this.connection, this._consumers, params)
    this._consumers.set(consumer.id, consumer)
    return consumer
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

  public get consumers(): Map<string, Consumer> {
    return this._consumers
  }

  public isOpen(): boolean {
    return this.connection ? this.connection.is_open() : false
  }
}

function buildConnectParams(envParams: EnvironmentParams, connParams?: ConnectionParams): ConnectionOptions {
  return {
    ...envParams,
    ...buildReconnectParams(connParams),
  }
}

function buildReconnectParams(connParams?: ConnectionParams) {
  if (connParams && connParams.reconnect) {
    return {
      reconnect: connParams.reconnect,
      initial_reconnect_delay: connParams.initialReconnectDelay,
      max_reconnect_delay: connParams.maxReconnectDelay,
      reconnect_limit: connParams.reconnectLimit,
    }
  }

  if (connParams && !connParams.reconnect) return { reconnect: false }

  return { reconnect: true }
}
