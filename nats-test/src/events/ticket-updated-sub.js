import Listener from "./base-listener.js";

class TicketUpdatedListener extends Listener {
  subject = "ticket:updated";
  queueGroupName = "ticket-services";

  onMessage(data, msg) {
    console.log("data", data);
    msg.ack();
  }
}

export default TicketUpdatedListener