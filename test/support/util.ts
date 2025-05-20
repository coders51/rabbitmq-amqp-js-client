import { inspect } from "util"
import got, { Response } from "got"

export type QueueInfoResponse = {
  name: string
}

const host = process.env.RABBITMQ_HOSTNAME ?? "localhost"
const managementPort = 15672
const vhost = encodeURIComponent("/")
export const username = process.env.RABBITMQ_USER ?? "rabbit"
export const password = process.env.RABBITMQ_PASSWORD ?? "rabbit"

export async function existsQueue(queueName: string): Promise<boolean> {
  const response = await getQueueInfo(queueName)

  if (!response.ok) {
    if (response.statusCode === 404) return false

    throw new Error(`HTTPError: ${inspect(response)}`)
  }

  return response.ok
}

async function getQueueInfo(queue: string): Promise<Response<QueueInfoResponse>> {
  const response = await got.get<QueueInfoResponse>(`http://${host}:${managementPort}/api/queues/${vhost}/${queue}`, {
    headers: {
      Authorization: `Basic ${Buffer.from(`${username}:${password}`).toString("base64")}`,
    },
    responseType: "json",
    throwHttpErrors: false,
  })

  return response
}
