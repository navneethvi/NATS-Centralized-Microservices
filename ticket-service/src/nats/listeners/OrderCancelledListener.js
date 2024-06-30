import { Ticket } from "../../models/ticketSchema.js";
import Listener from "../definition/base-listener.js";

import TicketUpdatedPublisher from "../publishers/TicketUpdatedPublisher.js";

class OrderCancelledListener extends Listener {
    subject = 'order:cancelled'
    queueGroupName = 'ticket-service'

    async onMessage(data,msg){
        console.log('data',data);
        const ticket = await Ticket.findById({_id:data.ticket.id})
        if(!ticket){
            throw new Error('Ticket not Found')
        }
        ticket.set({orderID:data.id})
        await ticket.save()
        await new TicketUpdatedPublisher(natsWrapper.getClient()).publish({
            id:ticket._id,
            title:ticket.title,
            price:ticket.price,
            userId:ticket.userId,
            version:ticket.version,
            orderID:ticket.orderID
        })
        msg.ack()
    }
}

export default OrderCancelledListener