import Publisher from "./base-publisher.js";

class TicketCreatedPublisher extends Publisher {
  subject = "ticket:created";
}

export default TicketCreatedPublisher;
