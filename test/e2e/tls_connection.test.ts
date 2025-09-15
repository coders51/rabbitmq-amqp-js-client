import { describe, expect, test } from "vitest"
import { createEnvironment, Environment } from "../../src/environment.js"
import { host, username, eventually, numberOfConnections, password } from "../support/util.js"
import { Connection } from "../../src/connection.js"
import { readFile } from "fs/promises"

describe("TLS Connection", () => {
  const LOCAL_TEST_CN = "rabbitmq"

  let environment: Environment
  let connection: Connection

  test("creating a TLS connection", async () => {
    const cn = process.env.CN ?? LOCAL_TEST_CN
    const tls = {
      ca: await readFile("./tls-gen/basic/result/ca_certificate.pem", "utf8"),
      cert: await readFile(`./tls-gen/basic/result/client_${cn}_certificate.pem`, "utf8"),
      key: await readFile(`./tls-gen/basic/result/client_${cn}_key.pem`, "utf8"),
      rejectUnauthorized: true,
    }

    environment = createEnvironment({ host, port: 5671, username, password, tls })

    connection = await environment.createConnection()

    await eventually(async () => {
      expect(await numberOfConnections()).to.eql(1)
    })
    await connection.close()
    await environment.close()
  })
})
