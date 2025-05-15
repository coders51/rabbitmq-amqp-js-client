import ky, { KyResponse } from "ky"
import { inspect } from "util"

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
    if (response.status === 404) return false

    throw new Error(`HTTPError: ${inspect(response)}`)
  }

  return response.ok
}

async function getQueueInfo(queue: string): Promise<KyResponse<QueueInfoResponse>> {
  const response = await ky.get<QueueInfoResponse>(`http://${host}:${managementPort}/api/queues/${vhost}/${queue}`, {
    headers: {
      Authorization: Buffer.from(`${username}:${password}`).toString("base64"),
    },
    throwHttpErrors: false,
  })

  return response
}
