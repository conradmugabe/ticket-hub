import {
  Publisher,
  Topics,
  TicketCreatedEvent,
} from '@mors_remorse/ticket-hub-common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly topic = Topics.TicketCreated;
}
