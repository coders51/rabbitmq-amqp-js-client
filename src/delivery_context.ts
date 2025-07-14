import { Delivery, MessageAnnotations, Receiver } from "rhea"

export interface DeliveryContext {
  accept(): void
  discard(annotations?: MessageAnnotations): void
  requeue(annotations?: MessageAnnotations): void
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

  discard(annotations?: MessageAnnotations): void {
    if (this.receiverLink.is_closed()) throw new Error("Receiver link is closed")
    if (!annotations) {
      this.delivery.reject()
      return
    }

    this.discardWithAnnotations(annotations)
  }

  private discardWithAnnotations(annotations: MessageAnnotations): void {
    this.delivery.modified({
      delivery_failed: true,
      undeliverable_here: true,
      message_annotations: annotations,
    })
  }

  requeue(annotations?: MessageAnnotations): void {
    if (this.receiverLink.is_closed()) throw new Error("Receiver link is closed")
    if (!annotations) {
      this.delivery.release()
      return
    }

    this.requeueWithAnnotations(annotations)
  }

  private requeueWithAnnotations(annotations: MessageAnnotations): void {
    this.delivery.modified({
      delivery_failed: false,
      undeliverable_here: false,
      message_annotations: annotations,
    })
  }
}
