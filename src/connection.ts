import { ConnectionEvents, Connection as RheaConnection } from "rhea"

export interface Connection {
  close(): Promise<boolean>
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
        console.error("ERROR: ", context.connection.error)
        return rej(false)
      })

      this.rheaConnection.close()
    })
  }
}
