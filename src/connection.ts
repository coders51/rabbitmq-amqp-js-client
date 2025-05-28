import { ConnectionEvents, Connection as RheaConnection } from "rhea"

export interface Connection {
  close(): Promise<boolean>
  isOpen(): boolean
}

export class AmqpConnection implements Connection {
  private readonly rheaConnection: RheaConnection

  constructor(connection: RheaConnection) {
    this.rheaConnection = connection
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

  public isOpen(): boolean {
    return this.rheaConnection.is_open()
  }
}
