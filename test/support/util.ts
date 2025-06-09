import { inspect } from "util"
import got, { Response } from "got"
import { AssertionError } from "assertion-error"
import { expect } from "vitest"

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

export const host = process.env.RABBITMQ_HOSTNAME ?? "localhost"
export const port = parseInt(process.env.RABBITMQ_PORT ?? "5672")
export const managementPort = 15672
export const vhost = encodeURIComponent("/")
export const username = process.env.RABBITMQ_USER ?? "rabbit"
export const password = process.env.RABBITMQ_PASSWORD ?? "rabbit"

export async function numberOfConnections(): Promise<number> {
  const response = await got.get<ConnectionInfoResponse[]>(`http://${host}:${managementPort}/api/connections`, {
    username,
    password,
    responseType: "json",
  })

  return response.body.length
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

export async function existsExchange(exchangeName: string): Promise<boolean> {
  const response = await getExchangeInfo(exchangeName)

  if (!response.ok) {
    if (response.statusCode === 404) return false

    throw new Error(`HTTPError: ${inspect(response)}`)
  }

  return response.ok
}

async function getExchangeInfo(exchange: string): Promise<Response<QueueInfoResponse>> {
  const response = await got.get<QueueInfoResponse>(
    `http://${host}:${managementPort}/api/exchanges/${vhost}/${exchange}`,
    {
      headers: {
        Authorization: `Basic ${Buffer.from(`${username}:${password}`).toString("base64")}`,
      },
      responseType: "json",
      throwHttpErrors: false,
    }
  )

  console.log(response.body)
  return response
}

export async function deleteExchange(exchange: string): Promise<Response<unknown>> {
  const response = await got.delete(`http://${host}:${managementPort}/api/exchanges/${vhost}/${exchange}`, {
    headers: {
      Authorization: `Basic ${Buffer.from(`${username}:${password}`).toString("base64")}`,
    },
    searchParams: {
      "if-unused": true,
    },
    responseType: "json",
    throwHttpErrors: false,
  })

  console.log(response.body)
  return response
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
