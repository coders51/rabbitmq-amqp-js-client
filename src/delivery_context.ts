import { Delivery, Message, MessageAnnotations } from "rhea"

export interface DeliveryContext {
  accept(): void
  discard(annotations?: MessageAnnotations): void
  requeue(annotations?: MessageAnnotations): void
}

export class AmqpDeliveryContext implements DeliveryContext {
  constructor(
    private readonly delivery: Delivery,
    private readonly message: Message
  ) {}

  accept(): void {
    console.log("accepted")
    this.delivery.accept()
  }

  discard(annotations?: MessageAnnotations): void {
    if (!annotations) {
      console.log(this.message)
      this.delivery.reject()
      return
    }

    this.discardWithAnnotations(annotations)
    return
  }

  private discardWithAnnotations(annotations: MessageAnnotations): void {
    const messageAnnotations: MessageAnnotations = {}
    for (const elem of Object.entries(annotations)) {
      Object.defineProperty(messageAnnotations, Symbol(elem[0]), { value: elem[1] })
    }

    const message = {
      delivery_failed: true,
      undeliverable_here: true,
      message_annotations: messageAnnotations,
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
    const messageAnnotations: MessageAnnotations = {}
    for (const elem of Object.entries(annotations)) {
      Object.defineProperty(messageAnnotations, Symbol(elem[0]), { value: elem[1] })
    }

    const message = {
      delivery_failed: false,
      undeliverable_here: false,
      message_annotations: messageAnnotations,
    }
    this.delivery.modified(message)
  }
}
