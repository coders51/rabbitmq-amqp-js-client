import { inspect } from "util"
import got, { Response } from "got"
import { AssertionError } from "assertion-error"
import { expect } from "vitest"
import { createSecretKey } from "crypto"
import * as jwt from "jsonwebtoken"

export type ConnectionInfoResponse = {
  name: string
}

export type QueueInfoResponse = {
  name: string
  node: string
  messages: number
  consumers: number
  arguments: Record<string, string>
  auto_delete: boolean
  durable: boolean
  exclusive: boolean
  type: string
}

export type ExchangeInfoResponse = {
  name: string
  arguments: Record<string, string>
  auto_delete: boolean
  durable: boolean
  type: string
}

export type BindingInfoResponse = {
  source: string
  vhost: string
  destination: string
  destination_type: string
  routing_key: string
  arguments: Record<string, string>
  properties_key: string
}

export const host = process.env.RABBITMQ_HOSTNAME ?? "localhost"
export const port = parseInt(process.env.RABBITMQ_PORT ?? "5672")
export const managementPort = 15672
export const vhost = encodeURIComponent("/")
export const username = process.env.RABBITMQ_USER ?? "rabbit"
export const password = process.env.RABBITMQ_PASSWORD ?? "rabbit"

export async function getConnections(): Promise<ConnectionInfoResponse[]> {
  const ret = await got.get<ConnectionInfoResponse[]>(`http://${host}:${managementPort}/api/connections`, {
    username,
    password,
    responseType: "json",
  })
  return ret.body
}

export async function numberOfConnections(): Promise<number> {
  const response = await got.get<ConnectionInfoResponse[]>(`http://${host}:${managementPort}/api/connections`, {
    username,
    password,
    responseType: "json",
  })

  return response.body.length
}

export async function closeAllConnections(): Promise<void> {
  const l = await getConnections()
  await Promise.all(l.map((c) => closeConnection(c.name)))
}

export async function closeConnection(name: string) {
  return got.delete(`http://${host}:${managementPort}/api/connections/${name}`, {
    username,
    password,
    responseType: "json",
  })
}

export async function existsQueue(queueName: string): Promise<boolean> {
  const response = await getQueueInfo(queueName)

  if (!response.ok) {
    if (response.statusCode === 404) return false

    throw new Error(`HTTPError: ${inspect(response)}`)
  }

  return response.ok
}

export async function getQueueInfo(queue: string): Promise<Response<QueueInfoResponse>> {
  const response = await got.get<QueueInfoResponse>(`http://${host}:${managementPort}/api/queues/${vhost}/${queue}`, {
    headers: {
      Authorization: `Basic ${Buffer.from(`${username}:${password}`).toString("base64")}`,
    },
    responseType: "json",
    throwHttpErrors: false,
  })

  return response
}

export async function createQueue(queue: string): Promise<boolean> {
  const response = await got.put(`http://${host}:${managementPort}/api/queues/${vhost}/${queue}`, {
    headers: {
      Authorization: `Basic ${Buffer.from(`${username}:${password}`).toString("base64")}`,
    },
    json: {
      name: queue,
    },
    throwHttpErrors: false,
  })

  return response.ok
}

export async function deleteQueue(queue: string): Promise<Response<unknown>> {
  const response = await got.delete(`http://${host}:${managementPort}/api/queues/${vhost}/${queue}`, {
    headers: {
      Authorization: `Basic ${Buffer.from(`${username}:${password}`).toString("base64")}`,
    },
    responseType: "json",
    throwHttpErrors: false,
  })

  return response
}

async function getQueues(): Promise<QueueInfoResponse[]> {
  const ret = await got.get<QueueInfoResponse[]>(`http://${host}:${managementPort}/api/queues/${vhost}`, {
    headers: {
      Authorization: `Basic ${Buffer.from(`${username}:${password}`).toString("base64")}`,
    },
    responseType: "json",
  })

  return ret.body
}

export async function deleteAllQueues({ match }: { match: RegExp } = { match: /.*/ }): Promise<void> {
  const queues = await getQueues()
  await Promise.all(queues.filter((q) => match && q.name.match(match)).map((q) => deleteQueue(q.name)))
}

export async function existsExchange(exchangeName: string): Promise<boolean> {
  const response = await getExchangeInfo(exchangeName)

  if (!response.ok) {
    if (response.statusCode === 404) return false

    throw new Error(`HTTPError: ${inspect(response)}`)
  }

  return response.ok
}

export async function getExchangeInfo(exchange: string): Promise<Response<ExchangeInfoResponse>> {
  const response = await got.get<ExchangeInfoResponse>(
    `http://${host}:${managementPort}/api/exchanges/${vhost}/${exchange}`,
    {
      headers: {
        Authorization: `Basic ${Buffer.from(`${username}:${password}`).toString("base64")}`,
      },
      responseType: "json",
      throwHttpErrors: false,
    }
  )

  return response
}

export async function createExchange(exchange: string): Promise<Response<unknown>> {
  const response = await got.put(`http://${host}:${managementPort}/api/exchanges/${vhost}/${exchange}`, {
    headers: {
      Authorization: `Basic ${Buffer.from(`${username}:${password}`).toString("base64")}`,
    },
    responseType: "json",
    throwHttpErrors: false,
    json: {
      type: "direct",
      auto_delete: false,
      durable: false,
      internal: false,
      arguments: {},
    },
  })

  return response
}

export async function deleteExchange(exchange: string): Promise<Response<unknown>> {
  const response = await got.delete(`http://${host}:${managementPort}/api/exchanges/${vhost}/${exchange}`, {
    headers: {
      Authorization: `Basic ${Buffer.from(`${username}:${password}`).toString("base64")}`,
    },
    responseType: "json",
    throwHttpErrors: false,
  })

  return response
}

async function getExchanges(): Promise<ExchangeInfoResponse[]> {
  const ret = await got.get<ExchangeInfoResponse[]>(`http://${host}:${managementPort}/api/exchanges/${vhost}`, {
    headers: {
      Authorization: `Basic ${Buffer.from(`${username}:${password}`).toString("base64")}`,
    },
    responseType: "json",
  })

  return ret.body
}

export async function deleteAllExchanges({ match }: { match: RegExp } = { match: /.*/ }): Promise<void> {
  const exchanges = await getExchanges()
  await Promise.all(exchanges.filter((e) => match && e.name.match(match)).map((e) => deleteExchange(e.name)))
}

export async function existsBinding(params: {
  source: string
  destination: string
  type: "exchangeToQueue" | "exchangeToExchange"
}): Promise<boolean> {
  const response = await getBinging(params)

  if (!response.ok) {
    if (response.statusCode === 404) return false

    throw new Error(`HTTPError: ${inspect(response)}`)
  }

  return response.body.length > 0
}

export async function getBinging(params: {
  source: string
  destination: string
  type: "exchangeToQueue" | "exchangeToExchange"
}): Promise<Response<BindingInfoResponse[]>> {
  const response = await got.get<BindingInfoResponse[]>(buildBindingEndpointFrom(params), {
    headers: {
      Authorization: `Basic ${Buffer.from(`${username}:${password}`).toString("base64")}`,
    },
    responseType: "json",
    throwHttpErrors: false,
  })

  return response
}

function buildBindingEndpointFrom(params: {
  source: string
  destination: string
  type: "exchangeToQueue" | "exchangeToExchange"
}): string {
  const queueOrExchange = params.type === "exchangeToQueue" ? "q" : "e"
  return `http://${host}:${managementPort}/api/bindings/${vhost}/e/${params.source}/${queueOrExchange}/${params.destination}`
}

export async function createBinding(
  routingKey: string,
  params: {
    source: string
    destination: string
    type: "exchangeToQueue" | "exchangeToExchange"
  }
): Promise<Response<unknown>> {
  const response = await got.post(buildBindingEndpointFrom(params), {
    headers: {
      Authorization: `Basic ${Buffer.from(`${username}:${password}`).toString("base64")}`,
    },
    body: JSON.stringify({
      routing_key: routingKey,
    }),
    responseType: "json",
    throwHttpErrors: false,
  })

  return response
}

export async function deleteBinding(params: {
  source: string
  destination: string
  type: "exchangeToQueue" | "exchangeToExchange"
}): Promise<Response<unknown>> {
  const response = await got.delete(buildBindingEndpointFrom(params), {
    headers: {
      Authorization: `Basic ${Buffer.from(`${username}:${password}`).toString("base64")}`,
    },
    responseType: "json",
    throwHttpErrors: false,
  })

  return response
}

async function getBindings(): Promise<BindingInfoResponse[]> {
  const ret = await got.get<BindingInfoResponse[]>(`http://${host}:${managementPort}/api/bindings/${vhost}`, {
    headers: {
      Authorization: `Basic ${Buffer.from(`${username}:${password}`).toString("base64")}`,
    },
    responseType: "json",
  })

  return ret.body
}

export async function deleteAllBindings(): Promise<void> {
  const bindings = await getBindings()
  await Promise.all(
    bindings.map((b) =>
      deleteBinding({
        source: b.source,
        destination: b.destination,
        type: b.destination_type === "queue" ? "exchangeToQueue" : "exchangeToExchange",
      })
    )
  )
}

export async function cleanRabbit({ match }: { match: RegExp } = { match: /.*/ }): Promise<void> {
  await deleteAllBindings()
  await deleteAllQueues({ match })
  await deleteAllExchanges({ match })
}

export async function wait(ms: number) {
  return new Promise((res) => {
    setTimeout(() => res(true), ms)
  })
}

export function elapsedFrom(from: number): number {
  return Date.now() - from
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export async function eventually(fn: Function, timeout = 5000) {
  const start = Date.now()
  while (true) {
    try {
      await fn()
      return
    } catch (error) {
      if (elapsedFrom(start) > timeout) {
        if (error instanceof AssertionError) throw error
        expect.fail(error instanceof Error ? error.message : String(error))
      }
      await wait(5)
    }
  }
}

const base64Key = "abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGH"
const audience = "rabbitmq"

export function generateToken(username: string, duration: number) {
  const bytes = Buffer.from(base64Key, "base64")
  const claims = {
    scope: "rabbitmq.configure:*/* rabbitmq.write:*/* rabbitmq.read:*/*",
    random: randomString(6),
  }

  const key = createSecretKey(bytes)
  const token = jwt.sign(claims, key, {
    subject: username,
    audience,
    expiresIn: duration,
    issuer: "unit_test",
    keyid: "token-key",
  })
  return token
}

function randomString(length: number) {
  const charSet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  let randomString = ""
  for (let i = 0; i < length; i++) {
    const randomPosition = Math.floor(Math.random() * charSet.length)
    randomString += charSet.substring(randomPosition, randomPosition + 1)
  }
  return randomString
}
