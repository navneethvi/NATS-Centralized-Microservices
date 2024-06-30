import Publisher from "../definition/base-publisher.js";

class OrderCreatedPublisher extends Publisher {
    subject = "order:created"
}

export default OrderCreatedPublisher