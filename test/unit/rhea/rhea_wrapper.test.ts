import { describe, expect, test, vi } from "vitest"
import type { WebSocketImpl } from "rhea"
import { buildConnectParams } from "../../../src/rhea_wrapper.js"
import type { EnvironmentParams } from "../../../src/environment.js"

// rhea's websocket_connect(Impl)(url, protocols, options) returns a factory function.
// Only calling that factory's .connect() method creates a real WebSocket, so
// connection_details() can be safely invoked in tests without a live broker.

// ConnectionDetails doesn't expose username/password in its TypeScript type, but
// rhea reads those fields from the object for OAuth reconnect.
type OAuthConnectionDetails = { host: string; port: number; username?: string; password?: string }

function callConnectionDetails(params: ReturnType<typeof buildConnectParams>): OAuthConnectionDetails {
  const fn = params.connection_details as unknown as ((n: number) => OAuthConnectionDetails) | undefined
  if (!fn) throw new Error("connection_details not set on params")
  return fn(0)
}

const wsImpl = {} as unknown as WebSocketImpl

describe("buildConnectParams: WebSocket + OAuth token refresh", () => {
  test("WebSocket + OAuth: connection_details returns the live token on each call", () => {
    let currentToken = "initial-token"
    const getOauthPassword = vi.fn(() => currentToken)

    const envParams: EnvironmentParams = {
      host: "broker.example.com",
      port: 5671,
      username: "app-user",
      password: "initial-token",
      webSocket: { implementation: wsImpl },
      oauth: { token: "initial-token" },
    }

    const params = buildConnectParams(envParams, undefined, getOauthPassword)

    // Before refresh: initial token is used
    expect(callConnectionDetails(params).password).toBe("initial-token")

    // Simulate refreshToken() updating the live token
    currentToken = "refreshed-token"

    // Rhea calls connection_details() on reconnect — must return the refreshed token
    const reconnectDetails = callConnectionDetails(params)
    expect(reconnectDetails.password).toBe("refreshed-token")
    expect(reconnectDetails.username).toBe("app-user")
  })

  test("WebSocket without OAuth: connection_details does not inject credentials", () => {
    const envParams: EnvironmentParams = {
      host: "broker.example.com",
      port: 5671,
      username: "user",
      password: "pass",
      webSocket: { implementation: wsImpl },
    }

    const params = buildConnectParams(envParams, undefined, undefined)
    const details = callConnectionDetails(params)

    expect(details.password).toBeUndefined()
    expect(details.username).toBeUndefined()
  })

  test("WebSocket + OAuth without getOauthPassword: connection_details does not inject credentials", () => {
    const envParams: EnvironmentParams = {
      host: "broker.example.com",
      port: 5671,
      username: "app-user",
      password: "initial-token",
      webSocket: { implementation: wsImpl },
      oauth: { token: "initial-token" },
    }

    const params = buildConnectParams(envParams, undefined, undefined)
    const details = callConnectionDetails(params)

    expect(details.password).toBeUndefined()
  })

  test("OAuth without WebSocket: connection_details uses live token", () => {
    let currentToken = "initial-token"
    const getOauthPassword = vi.fn(() => currentToken)

    const envParams: EnvironmentParams = {
      host: "broker.example.com",
      port: 5671,
      username: "app-user",
      password: "initial-token",
      oauth: { token: "initial-token" },
    }

    const params = buildConnectParams(envParams, undefined, getOauthPassword)

    currentToken = "refreshed-token"
    const reconnectDetails = callConnectionDetails(params)
    expect(reconnectDetails.password).toBe("refreshed-token")
  })
})
