import { AmqpConnection, Connection } from "./connection.js"

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
  constructor(
    private readonly params: EnvironmentParams,
    private readonly connections: Connection[] = []
  ) {}

  async createConnection(): Promise<Connection> {
    const connection = await AmqpConnection.create(this.params)
    this.connections.push(connection)
    return connection
  }

  async close(): Promise<void> {
    await this.closeConnections()
    this.connections.length = 0
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
