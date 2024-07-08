import Ticket from "../../models/ticketSchema.js";

import Listener from "../definition/base-listener.js";

class TicketCreatedListener extends Listener {
  subject = "ticket:created";
  queueGroupName = "order-service";

  async onMessage(data, msg) {
    const { id, title, price } = data;
    const newTicket = await Ticket.create({
      _id: id,
      title,
      price,
    });
    console.log("newTicket : ",newTicket);
    msg.ack();
  }
}

export default TicketCreatedListener;
