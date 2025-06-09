export type ExchangeType = "direct" | "fanout" | "topic" | "headers"

export type ExchangeOptions = {
  auto_delete: boolean
  durable: boolean
  type: ExchangeType
}

export interface ExchangeInfo {
  name: string
}

export class AmqpExchangeInfo implements ExchangeInfo {
  private exchangeName: string

  constructor(params: { name: string }) {
    this.exchangeName = params.name
  }

  public get name(): string {
    return this.exchangeName
  }
}
