import Listener from "./base-listener.js";

class TicketCreatedListener extends Listener {
  subject = "ticket:created";
  queueGroupName = "ticket-services";

  onMessage(data, msg) {
    console.log("data", data);
    msg.ack();
  }
}

export default TicketCreatedListener