import ky, { KyResponse } from "ky"
import { inspect } from "util"

export type QueueInfoResponse = {
  name: string
}

const host = "localhost"
const port = 15672
const vhost = encodeURIComponent("/")
const password = "rabbit"
const username = "rabbit"

export async function existsQueue(queueName: string): Promise<boolean> {
  const response = await getQueueInfo(queueName)

  if (!response.ok) {
    if (response.status === 404) return false

    throw new Error(`HTTPError: ${inspect(response)}`)
  }

  return response.ok
}

async function getQueueInfo(queue: string): Promise<KyResponse<QueueInfoResponse>> {
  const response = await ky.get<QueueInfoResponse>(`http://${host}:${port}/api/queues/${vhost}/${queue}`, {
    headers: {
      Authorization: Buffer.from(`${username}:${password}`).toString("base64"),
    },
    throwHttpErrors: false,
  })

  return response
}
