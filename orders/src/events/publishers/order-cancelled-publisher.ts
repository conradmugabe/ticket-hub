import {
  Publisher,
  Topics,
  OrderCancelledEvent,
} from '@mors_remorse/ticket-hub-common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly topic = Topics.OrderCancelled;
}
