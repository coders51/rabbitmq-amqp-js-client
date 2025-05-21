import { Connection } from "./connection"

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
  static create(params: EnvironmentParams): Promise<AmqpEnvironment> {
    return Promise.resolve(new AmqpEnvironment(params))
  }

  constructor(private params: EnvironmentParams) {}

  createConnection(): Promise<Connection> {
    return Promise.resolve({ name: "123.123.123connection" })
  }
  close(): Promise<void> {
    return Promise.resolve()
  }
}
