import { ConnectionEvents, Connection as RheaConnection } from "rhea"
import { AmqpManagement, Management } from "./management.js"
import { EnvironmentParams } from "./environment.js"
import { AmqpPublisher, Publisher } from "./publisher.js"
import { DestinationOptions } from "./message.js"
import { AmqpConsumer, Consumer, CreateConsumerParams } from "./consumer.js"
import { openRheaConnection } from "./rhea_wrapper.js"
import { isBrokerVersionAtLeast } from "./utils.js"

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

class PasswordBridge {
  private func: (() => string) | null = null

  register(func: () => string) {
    this.func = func
  }

  getPassword(): string {
    return this.func ? this.func() : ""
  }
}

export type BrokerFeatures = {
  directReplyTo: boolean
  consumerPriority: boolean
}

const NO_BROKER_FEATURES: BrokerFeatures = { directReplyTo: false, consumerPriority: false }

export function checkConsumerFeaturesSupported(params: CreateConsumerParams, features: BrokerFeatures) {
  if ("directReplyTo" in params && params.directReplyTo && !features.directReplyTo) {
    throw new Error("Direct reply-to is not supported by this broker. RabbitMQ 4.2 or later is required.")
  }
  if ("priority" in params && params.priority !== undefined && !features.consumerPriority) {
    throw new Error("Consumer priority is not supported by this broker. RabbitMQ 4.3 or later is required.")
  }
}

export class AmqpConnection implements Connection {
  private _publishers: Map<string, Publisher> = new Map<string, Publisher>()
  private _consumers: Map<string, Consumer> = new Map<string, Consumer>()

  static async create(envParams: EnvironmentParams, connParams?: ConnectionParams) {
    const bridge = new PasswordBridge()

    const rheaConnection = await openRheaConnection(
      envParams,
      connParams,
      envParams.oauth ? () => bridge.getPassword() : undefined
    )
    const topologyManagement = await AmqpManagement.create(rheaConnection)
    const features: BrokerFeatures = {
      directReplyTo: isBrokerVersionAtLeast(rheaConnection.properties, 4, 2),
      consumerPriority: isBrokerVersionAtLeast(rheaConnection.properties, 4, 3),
    }
    return new AmqpConnection(
      rheaConnection,
      topologyManagement,
      envParams.oauth ? envParams.oauth.token : envParams.password,
      bridge,
      features
    )
  }

  constructor(
    private readonly connection: RheaConnection,
    private readonly topologyManagement: Management,
    private password: string,
    bridge: PasswordBridge,
    private readonly features: BrokerFeatures = NO_BROKER_FEATURES
  ) {
    bridge.register(() => this.getPassword())
  }

  private getPassword() {
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
    checkConsumerFeaturesSupported(params, this.features)
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
