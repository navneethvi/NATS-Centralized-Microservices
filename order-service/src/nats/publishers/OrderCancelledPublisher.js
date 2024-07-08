import Publisher from "../definition/base-publisher.js";

class OrderCancelledPublisher extends Publisher{
    subject = "order:cancelled"
}

export default OrderCancelledPublisher