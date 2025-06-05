import { ConnectionEvents, Container, create_container } from "rhea"
import { AmqpConnection, Connection } from "./connection.js"
import { Connection as RheaConnection } from "rhea"

export interface Environment {
  createConnection(): Promise<Connection>
  close(): Promise<void>
}

export type EnvironmentParams = {
  host: string
  port: number
  username: string
  password: string
}

export class AmqpEnvironment implements Environment {
  private readonly host: string
  private readonly port: number
  private readonly username: string
  private readonly password: string
  private readonly container: Container
  private connections: Connection[] = []

  constructor({ host, port, username, password }: EnvironmentParams) {
    this.host = host
    this.port = port
    this.username = username
    this.password = password
    this.container = create_container()
  }

  async createConnection(): Promise<Connection> {
    const rheaConnection = await this.openConnection()
    const connection = new AmqpConnection(rheaConnection)
    this.connections.push(connection)

    return connection
  }

  private async openConnection(): Promise<RheaConnection> {
    return new Promise((res, rej) => {
      this.container.once(ConnectionEvents.connectionOpen, (context) => {
        return res(context.connection)
      })
      this.container.once(ConnectionEvents.error, (context) => {
        return rej(context.error ?? new Error("Connection error occurred"))
      })

      this.container.connect({ host: this.host, port: this.port, username: this.username, password: this.password })
    })
  }

  async close(): Promise<void> {
    await this.closeConnections()
    this.connections = []
  }

  private async closeConnections(): Promise<void> {
    await Promise.allSettled(
      this.connections.map(async (c) => {
        if (c.isOpen()) await c.close()
      })
    )
  }
}

export function createEnvironment(params: EnvironmentParams): Environment {
  return new AmqpEnvironment(params)
}
