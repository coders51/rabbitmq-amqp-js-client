import { createEnvironment, createAmqpMessage, Offset } from "rabbitmq-amqp-js-client"
import { randomUUID } from "crypto"

const rabbitUser = process.env.RABBITMQ_USER ?? "rabbit"
const rabbitPassword = process.env.RABBITMQ_PASSWORD ?? "rabbit"
const rabbitHost = process.env.RABBITMQ_HOSTNAME ?? "localhost"
const rabbitPort = process.env.RABBITMQ_PORT ?? 5672

const initialOffset = 1000n
const messageCount = 5

async function main() {
  const testStream = `test-stream-initial-offset-${randomUUID()}`

  console.log("Creating the environment...")
  const environment = createEnvironment({
    host: rabbitHost,
    port: rabbitPort,
    username: rabbitUser,
    password: rabbitPassword,
  })

  console.log("Opening a connection...")
  const connection = await environment.createConnection()
  const management = connection.management()

  console.log(`Creating a stream whose first message gets offset ${initialOffset} (RabbitMQ 4.4 or later)...`)
  await management.declareQueue(testStream, { type: "stream", maxLengthBytes: 5_000_000_000, initialOffset })

  console.log(`Opening a publisher and publishing ${messageCount} messages...`)
  const publisher = await connection.createPublisher({ queue: { name: testStream } })
  for (const i of Array(messageCount).keys()) {
    await publisher.publish(createAmqpMessage({ body: `Message #${i}` }))
  }
  publisher.close()

  console.log("Opening a consumer from the first message of the stream...")
  let received = 0
  const consumer = await connection.createConsumer({
    stream: { name: testStream, offset: Offset.first() },
    messageHandler: (context, msg) => {
      received++
      console.log(`[Consumer] Payload: ${msg.body}, offset: ${msg.message_annotations["x-stream-offset"]}`)
      context.accept()
    },
  })
  consumer.start()

  await sleep(2000)
  console.log(`Consumer received ${received} messages`)

  console.log("Cleaning up...")
  consumer.close()
  await management.deleteQueue(testStream)
  management.close()
  await connection.close()
  await environment.close()
}

main()
  .then(() => console.log("done!"))
  .catch((res) => {
    console.log("ERROR ", res)
    process.exit(-1)
  })
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
