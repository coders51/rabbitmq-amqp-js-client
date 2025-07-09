import { Delivery } from "rhea"

export interface DeliveryContext {
  accept(): void
  discard(): void
  requeue(): void
}

export class AmqpDeliveryContext implements DeliveryContext {
  constructor(private readonly delivery: Delivery) {}

  accept(): void {
    this.delivery.accept()
  }

  discard(): void {
    this.delivery.reject()
  }

  requeue(): void {
    this.delivery.release()
  }
}
