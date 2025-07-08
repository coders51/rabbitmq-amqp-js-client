import { Delivery, MessageAnnotations } from "rhea"

export interface DeliveryContext {
  accept(): void
  discard(annotations?: MessageAnnotations): void
  requeue(annotations?: MessageAnnotations): void
}

export class AmqpDeliveryContext implements DeliveryContext {
  constructor(private readonly delivery: Delivery) {}

  accept(): void {
    this.delivery.accept()
  }

  discard(annotations?: MessageAnnotations): void {
    if (!annotations) {
      this.delivery.reject()
      return
    }

    this.discardWithAnnotations(annotations)
    return
  }

  private discardWithAnnotations(annotations: MessageAnnotations): void {
    console.log("testAAAAA", annotations)
    const message = {
      delivery_failed: true,
      undeliverable_here: true,
      message_annotations: annotations,
    }
    this.delivery.modified(message)
  }

  requeue(annotations?: MessageAnnotations): void {
    if (!annotations) {
      console.log("requeue")
      this.delivery.release()
      return
    }

    this.requeueWithAnnotations(annotations)
    return
  }

  private requeueWithAnnotations(annotations: MessageAnnotations): void {
    console.log("requeue", annotations)

    const message = {
      delivery_failed: false,
      undeliverable_here: false,
      message_annotations: annotations,
    }
    this.delivery.modified(message)
  }
}
