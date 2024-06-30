import Publisher from "../definition/base-publisher.js";

class TicketUpdatedPublisher extends Publisher {
    subject = 'ticket:updated'
}

export default TicketUpdatedPublisher