// This example shows how to use consumer priority (RabbitMQ 4.3 or later).
// When several consumers are attached to the same queue, the broker delivers messages
// to the consumer with the highest priority as long as it has credits.
// See https://www.rabbitmq.com/docs/consumer-priority
import { createEnvironment, createAmqpMessage } from "rabbitmq-amqp-js-client"
import { randomUUID } from "crypto"

const rabbitUser = process.env.RABBITMQ_USER ?? "rabbit"
const rabbitPassword = process.env.RABBITMQ_PASSWORD ?? "rabbit"
const rabbitHost = process.env.RABBITMQ_HOSTNAME ?? "localhost"
const rabbitPort = process.env.RABBITMQ_PORT ?? 5672

async function main() {
  const testQueue = `test-consumer-priority-queue-${randomUUID()}`

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

  console.log("Creating a quorum queue...")
  await management.declareQueue(testQueue, { type: "quorum", durable: true })

  // The high priority consumer receives all the messages as long as it has credits:
  // the low priority consumer receives messages only when the high priority one is saturated.
  let highCount = 0
  let lowCount = 0

  console.log("Opening a high priority consumer (priority 10)...")
  const highPriorityConsumer = await connection.createConsumer({
    queue: { name: testQueue },
    priority: 10,
    messageHandler: (context, msg) => {
      highCount++
      console.log(`[High priority consumer] Payload: ${msg.body}`)
      context.accept()
    },
  })
  highPriorityConsumer.start()

  console.log("Opening a low priority consumer (priority 1)...")
  const lowPriorityConsumer = await connection.createConsumer({
    queue: { name: testQueue },
    priority: 1,
    messageHandler: (context, msg) => {
      lowCount++
      console.log(`[Low priority consumer] Payload: ${msg.body}`)
      context.accept()
    },
  })
  lowPriorityConsumer.start()

  console.log("Opening a publisher and publishing 20 messages...")
  const publisher = await connection.createPublisher({ queue: { name: testQueue } })
  for (const i of Array(20).keys()) {
    await publisher.publish(createAmqpMessage({ body: `Message #${i}` }))
  }
  publisher.close()

  await sleep(2000)
  console.log(`High priority consumer received ${highCount} messages, low priority consumer received ${lowCount}`)

  console.log("Cleaning up...")
  highPriorityConsumer.close()
  lowPriorityConsumer.close()
  await management.deleteQueue(testQueue)
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
