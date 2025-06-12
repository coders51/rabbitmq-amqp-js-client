export type ExchangeType = "direct" | "fanout" | "topic" | "headers"

export type ExchangeOptions = {
  arguments: Record<string, string>
  auto_delete: boolean
  durable: boolean
  type: ExchangeType
}

export interface ExchangeInfo {
  name: string
  arguments: Record<string, string>
  autoDelete: boolean
  durable: boolean
  type: string
}

export interface Exchange {
  getInfo: ExchangeInfo
}

export type DeletedExchangeInfo = {
  name: string
  deleted: boolean
}

export class AmqpExchange implements Exchange {
  constructor(private readonly info: ExchangeInfo) {}

  public get getInfo(): ExchangeInfo {
    return this.info
  }
}
