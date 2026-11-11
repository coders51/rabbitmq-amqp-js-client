import { Delivery, MessageAnnotations, Receiver } from "rhea"

export interface DeliveryContext {
  accept(): void
  discard(annotations?: MessageAnnotations): void
  requeue(annotations?: MessageAnnotations): void
}

export class AmqpDeliveryContext implements DeliveryContext {
  constructor(
    private readonly delivery: Delivery,
    private readonly receiverLink: Receiver,
    private readonly onSettled?: () => void
  ) {}

  accept(): void {
    if (this.receiverLink.is_closed()) throw new Error("Receiver link is closed")

    this.delivery.accept()
    this.onSettled?.()
  }

  discard(annotations?: MessageAnnotations): void {
    if (this.receiverLink.is_closed()) throw new Error("Receiver link is closed")
    if (!annotations) {
      this.delivery.reject()
      this.onSettled?.()
      return
    }

    this.discardWithAnnotations(annotations)
    this.onSettled?.()
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
      this.onSettled?.()
      return
    }

    this.requeueWithAnnotations(annotations)
    this.onSettled?.()
  }

  private requeueWithAnnotations(annotations: MessageAnnotations): void {
    this.delivery.modified({
      delivery_failed: false,
      undeliverable_here: false,
      message_annotations: annotations,
    })
  }
}

export class PreSettledDeliveryContext implements DeliveryContext {
  accept() {
    throw new Error("Pre-settle ON, message is already disposed.")
  }

  discard() {
    throw new Error("Pre-settle ON, message is already disposed.")
  }

  requeue() {
    throw new Error("Pre-settle ON, message is already disposed.")
  }
}
