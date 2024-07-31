import { Message } from 'node-nats-streaming';
import {
  Subscriber,
  TicketUpdatedEvent,
  Topics,
} from '@mors_remorse/ticket-hub-common';

import { queueGroupName } from './queue-group-name';
import { Ticket } from '../../models/ticket';

export class TicketUpdatedSubscriber extends Subscriber<TicketUpdatedEvent> {
  readonly topic = Topics.TicketUpdated;
  readonly queueGroupName = queueGroupName;

  async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {
    const { id, price, title } = data;

    const ticket = await Ticket.findById(id);
    if (!ticket) {
      throw new Error('Ticket not found');
    }

    ticket.set({ price, title });
    await ticket.save();

    msg.ack();
  }
}
