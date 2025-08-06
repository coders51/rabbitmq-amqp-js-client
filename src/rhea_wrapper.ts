import {
  Connection,
  ConnectionEvents,
  ConnectionOptions,
  create_container,
  Receiver,
  ReceiverEvents,
  ReceiverOptions,
  Connection as RheaConnection,
  Sender,
  SenderEvents,
  SenderOptions,
  websocket_connect,
} from "rhea"
import { MANAGEMENT_NODE_CONFIGURATION } from "./management.js"
import { ConnectionParams } from "./connection.js"
import { EnvironmentParams } from "./environment.js"

export async function openRheaConnection(
  envParams: EnvironmentParams,
  connParams?: ConnectionParams,
  getOauthPassword?: () => string
): Promise<RheaConnection> {
  return new Promise((res, rej) => {
    const container = create_container()
    container.once(ConnectionEvents.connectionOpen, (context) => {
      return res(context.connection)
    })
    container.once(ConnectionEvents.connectionError, (context) => {
      return rej(context.error ?? new Error("Connection error occurred"))
    })

    container.connect(buildConnectParams(envParams, connParams, getOauthPassword))
  })
}

export async function openSender(connection: RheaConnection): Promise<Sender> {
  return openLink<Sender>(
    connection,
    SenderEvents.senderOpen,
    SenderEvents.senderError,
    connection.open_sender.bind(connection),
    MANAGEMENT_NODE_CONFIGURATION
  )
}

export async function openReceiver(connection: RheaConnection): Promise<Receiver> {
  return openLink<Receiver>(
    connection,
    ReceiverEvents.receiverOpen,
    ReceiverEvents.receiverError,
    connection.open_receiver.bind(connection),
    MANAGEMENT_NODE_CONFIGURATION
  )
}

function buildConnectParams(
  envParams: EnvironmentParams,
  connParams?: ConnectionParams,
  getOauthPassword?: () => string
): ConnectionOptions {
  const reconnectParams = buildReconnectParams(connParams)
  if (envParams.webSocket) {
    const ws = websocket_connect(envParams.webSocket.implementation)
    const wsUrl = envParams.webSocket.url ?? `ws://${envParams.host}:${envParams.port}/ws`
    const connectionDetails = ws(wsUrl, "amqp", {})

    return {
      connection_details: () => {
        return {
          ...connectionDetails(),
          host: envParams.host,
          port: envParams.port,
        }
      },
      ...envParams,
      ...reconnectParams,
    }
  }

  if (envParams.oauth) {
    return {
      connection_details: () => {
        return {
          host: envParams.host,
          port: envParams.port,
          username: envParams.username,
          password: getOauthPassword ? getOauthPassword() : undefined,
          ...reconnectParams,
        }
      },
      host: envParams.host,
      port: envParams.port,
      username: envParams.username,
      password: envParams.oauth.token,
      ...reconnectParams,
    }
  }

  return {
    ...envParams,
    ...reconnectParams,
  }
}

function buildReconnectParams(connParams?: ConnectionParams) {
  if (connParams && connParams.reconnect) {
    return {
      reconnect: connParams.reconnect,
      initial_reconnect_delay: connParams.initialReconnectDelay,
      max_reconnect_delay: connParams.maxReconnectDelay,
      reconnect_limit: connParams.reconnectLimit,
    }
  }

  if (connParams && !connParams.reconnect) return { reconnect: false }

  return { reconnect: true }
}

export type LinkOpenEvents = SenderEvents.senderOpen | ReceiverEvents.receiverOpen
export type LinkErrorEvents = SenderEvents.senderError | ReceiverEvents.receiverError
export type OpenLinkMethods =
  | ((options?: SenderOptions | string) => Sender)
  | ((options?: ReceiverOptions | string) => Receiver)

export async function openLink<T extends Sender | Receiver>(
  connection: Connection,
  successEvent: LinkOpenEvents,
  errorEvent: LinkErrorEvents,
  openMethod: OpenLinkMethods,
  config?: SenderOptions | ReceiverOptions | string
): Promise<T> {
  return new Promise((res, rej) => {
    connection.once(successEvent, (context) => {
      return res(context.receiver || context.sender)
    })
    connection.once(errorEvent, (context) => {
      return rej(context.connection.error)
    })
    openMethod(config)
  })
}
