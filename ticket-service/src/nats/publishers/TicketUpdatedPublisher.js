import Publisher from "../definition/base-publisher";

class TicketUpdatedPublisher extends Publisher {
    subject = 'ticket:updated'
}

export default TicketUpdatedPublisher