import {
  Publisher,
  Topics,
  TicketUpdatedEvent,
} from '@mors_remorse/ticket-hub-common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly topic = Topics.TicketUpdated;
}
