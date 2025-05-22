import { Connection } from "./connection.js"

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
  constructor(private params: EnvironmentParams) {}

  createConnection(): Promise<Connection> {
    return Promise.resolve({ name: this.params.host })
  }

  close(): Promise<void> {
    return Promise.resolve()
  }

  static create(params: EnvironmentParams): Promise<AmqpEnvironment> {
    return Promise.resolve(new AmqpEnvironment(params))
  }
}
