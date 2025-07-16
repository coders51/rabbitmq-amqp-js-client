const rabbit = require("rabbitmq-amqp-js-client")
const { randomUUID } = require("crypto")

const rabbitUser = process.env.RABBITMQ_USER ?? "rabbit"
const rabbitPassword = process.env.RABBITMQ_PASSWORD ?? "rabbit"
const rabbitHost = process.env.RABBITMQ_HOSTNAME ?? "localhost"
const rabbitPort = process.env.RABBITMQ_PORT ?? 5672

async function main() {
  const testExchange = `test-exchange-${randomUUID()}`
  const testQueue = `test-queue-${randomUUID()}`
  const routingKey = `test-key-${randomUUID()}`

  console.log("Creating the environment...")
  const environment = rabbit.createEnvironment({
    host: rabbitHost,
    port: rabbitPort,
    username: rabbitUser,
    password: rabbitPassword,
    webSocket: WebSocket,
  })

  console.log("Opening a connection...")
  const connection = await environment.createConnection()
  const management = connection.management()

  console.log("Creating a queue and an exchange...")
  const queue = await management.declareQueue(testQueue)
  const exchange = await management.declareExchange(testExchange)

  console.log("Binding exchange to queue...")
  await management.bind(routingKey, { source: exchange, destination: queue })

  console.log("Opening a publisher and publishing 10 messages...")
  const publisher = await connection.createPublisher({ exchange: { name: testExchange, routingKey: routingKey } })
  for (const i of Array(10).keys()) {
    const publishResult = await publisher.publish(rabbit.createAmqpMessage({ body: `Hello - ${i} - ` }))
    switch (publishResult.outcome) {
      case rabbit.OutcomeState.ACCEPTED:
        console.log("Message Accepted")
        break
      case rabbit.OutcomeState.RELEASED:
        console.log("Message Released")
        break
      case rabbit.OutcomeState.REJECTED:
        console.log("Message Rejected")
        break
      default:
        break
    }
  }
  publisher.close()

  console.log("Opening a consumer and consuming messages...")
  const consumer = await connection.createConsumer({
    queue: { name: testQueue },
    messageHandler: (context, msg) => {
      context.accept()
      console.log(`MessageId: ${msg.message_id}; Payload: ${msg.body}`)
    },
  })
  consumer.start()
  await sleep(5000)

  console.log("Cleaning up...")
  consumer.close()
  await management.unbind(routingKey, { source: exchange, destination: queue })
  await management.deleteExchange(testExchange)
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
