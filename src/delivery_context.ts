import { Delivery, Receiver } from "rhea"

export interface DeliveryContext {
  accept(): void
  discard(): void
  requeue(): void
}

export class AmqpDeliveryContext implements DeliveryContext {
  constructor(
    private readonly delivery: Delivery,
    private readonly receiverLink: Receiver
  ) {}

  accept(): void {
    if (this.receiverLink.is_closed()) throw new Error("Receiver link is closed")

    this.delivery.accept()
  }

  discard(): void {
    if (this.receiverLink.is_closed()) throw new Error("Receiver link is closed")

    this.delivery.reject()
  }

  requeue(): void {
    if (this.receiverLink.is_closed()) throw new Error("Receiver link is closed")

    this.delivery.release()
  }
}
