import {
  Publisher,
  Topics,
  OrderCreatedEvent,
} from '@mors_remorse/ticket-hub-common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly topic = Topics.OrderCreated;
}
