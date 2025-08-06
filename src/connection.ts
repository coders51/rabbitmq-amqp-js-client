import { ConnectionEvents, Connection as RheaConnection } from "rhea"
import { AmqpManagement, Management } from "./management.js"
import { EnvironmentParams } from "./environment.js"
import { AmqpPublisher, Publisher } from "./publisher.js"
import { DestinationOptions } from "./message.js"
import { AmqpConsumer, Consumer, CreateConsumerParams } from "./consumer.js"
import { openRheaConnection } from "./rhea_wrapper.js"

export interface Connection {
  close(): Promise<boolean>
  isOpen(): boolean
  management(): Management
  createPublisher(options?: DestinationOptions): Promise<Publisher>
  get publishers(): Map<string, Publisher>
  get consumers(): Map<string, Consumer>
  createConsumer(params: CreateConsumerParams): Promise<Consumer>
  refreshToken: (token: string) => Promise<boolean>
}

export type ConnectionParams =
  | { reconnect: false }
  | {
      reconnect: true | number
      initialReconnectDelay?: number
      maxReconnectDelay?: number
      reconnectLimit?: number
    }

class PasswordSettings {
  private func: (() => string) | null = null

  register(func: () => string) {
    this.func = func
  }

  getPassword(): string {
    return this.func ? this.func() : ""
  }
}

export class AmqpConnection implements Connection {
  private _publishers: Map<string, Publisher> = new Map<string, Publisher>()
  private _consumers: Map<string, Consumer> = new Map<string, Consumer>()

  static async create(envParams: EnvironmentParams, connParams?: ConnectionParams) {
    const settings = new PasswordSettings()

    if (envParams.token) {
      const rheaOauthConnection = await openRheaConnection(envParams, connParams, () => settings.getPassword())
      const topologyManagement = await AmqpManagement.create(rheaOauthConnection)
      console.log("TOKEN", envParams.token)
      return new AmqpConnection(rheaOauthConnection, topologyManagement, settings, envParams.token)
    }

    const rheaPlainConnection = await openRheaConnection(envParams, connParams)
    const topologyManagement = await AmqpManagement.create(rheaPlainConnection)
    return new AmqpConnection(rheaPlainConnection, topologyManagement, settings, envParams.password!)
  }

  constructor(
    private readonly connection: RheaConnection,
    private readonly topologyManagement: Management,
    private readonly settings: PasswordSettings,
    private password: string
  ) {
    settings.register(() => this.getPassword())
  }

  private getPassword() {
    console.log("CALLED")
    return this.password
  }

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

  async refreshToken(token: string): Promise<boolean> {
    const ok = await this.topologyManagement.refreshToken(token)

    if (!ok) return false

    this.password = token
    return true
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
