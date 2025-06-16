import { Exchange } from "./exchange.js"
import { Queue } from "./queue.js"

export type BindingOptions = {
  source: Exchange
  destination: Exchange | Queue
  arguments?: Record<string, string>
}

export type BindingInfo = {
  id: string
  source: string
  destination: string
  arguments: Record<string, string>
}

export interface Binding {
  getInfo: BindingInfo
}

export class AmqpBinding implements Binding {
  constructor(private readonly info: BindingInfo) {}

  public get getInfo(): BindingInfo {
    return this.info
  }
}
