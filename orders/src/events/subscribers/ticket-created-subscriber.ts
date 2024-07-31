import { Message } from 'node-nats-streaming';
import {
  Subscriber,
  TicketCreatedEvent,
  Topics,
} from '@mors_remorse/ticket-hub-common';

import { queueGroupName } from './queue-group-name';
import { Ticket } from '../../models/ticket';

export class TicketCreatedSubscriber extends Subscriber<TicketCreatedEvent> {
  readonly topic = Topics.TicketCreated;
  readonly queueGroupName = queueGroupName;

  async onMessage(data: TicketCreatedEvent['data'], msg: Message) {
    const { id, price, title } = data;

    const ticket = Ticket.build({ id, price, title });
    await ticket.save();

    msg.ack();
  }
}
