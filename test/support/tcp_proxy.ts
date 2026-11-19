import { createConnection, createServer, Socket } from "net"

export type TcpProxy = {
  port: number
  dropConnections: () => void
  close: () => Promise<void>
}

export async function createTcpProxy(targetHost: string, targetPort: number): Promise<TcpProxy> {
  const sockets = new Set<Socket>()
  const track = (socket: Socket) => {
    sockets.add(socket)
    socket.on("close", () => sockets.delete(socket))
  }

  const server = createServer((client) => {
    const broker = createConnection(targetPort, targetHost)
    track(client)
    track(broker)
    client.pipe(broker).pipe(client)
    client.on("error", () => broker.destroy())
    broker.on("error", () => client.destroy())
  })
  await new Promise<void>((resolve) => server.listen(0, resolve))
  const address = server.address()
  if (!address || typeof address === "string") throw new Error("The TCP proxy is not listening on a port")

  return {
    port: address.port,
    dropConnections: () => sockets.forEach((socket) => socket.destroy(new Error("connection dropped by proxy"))),
    close: () =>
      new Promise<void>((resolve) => {
        sockets.forEach((socket) => socket.destroy())
        server.close(() => resolve())
      }),
  }
}
