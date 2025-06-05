import { ConnectionEvents, Connection as RheaConnection } from "rhea"
import { AmqpManagement, Management } from "./management.js"

export interface Connection {
  close(): Promise<boolean>
  isOpen(): boolean
  management(): Promise<Management>
}

export class AmqpConnection implements Connection {
  private readonly rheaConnection: RheaConnection
  private readonly topologyManagement: Management

  constructor(connection: RheaConnection) {
    this.rheaConnection = connection
    this.topologyManagement = new AmqpManagement(this.rheaConnection)
  }

  async close(): Promise<boolean> {
    return new Promise((res, rej) => {
      this.rheaConnection.once(ConnectionEvents.connectionClose, () => {
        return res(true)
      })
      this.rheaConnection.once(ConnectionEvents.connectionError, (context) => {
        return rej(new Error("Connection error: " + context.connection.error))
      })

      this.rheaConnection.close()
    })
  }

  async management(): Promise<Management> {
    await this.topologyManagement.open()

    return this.topologyManagement
  }

  public isOpen(): boolean {
    return this.rheaConnection ? this.rheaConnection.is_open() : false
  }
}
