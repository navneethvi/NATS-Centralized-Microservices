class Listener {
  constructor(client) {
    this.client = client;
    this.ackWait = 5 * 1000;
    this.onMessage;
    this.queueGroupName;
    this.subject;
  }

  subscriptionOptions() {
    return this.client
      .subscriptionOptions()
      .setDeliverAllAvailable()
      .setManualAckMode(true)
      .setAckWait(this.ackWait)
      .setDurableName(this.queueGroupName);
  }

  listen() {
    const subscription = this.client.subscribe(
      this.subject,
      this.queueGroupName,
      this.subscriptionOptions()
    );

    subscription.on("message", (msg) => {
      console.log(`Message Rec: ${this.subject} / ${this.queueGroupName}`);
      const parsedData = this.parseMessage(msg);
      this.onMessage(parsedData, msg);
    });
  }

  parseMessage(msg) {
    const data = msg.getData();
    if (!data) {
      console.error("Received empty message data.");
      return null;
    }
    try {
      return typeof data === "string"
        ? JSON.parse(data)
        : JSON.parse(data.toString("utf8"));
    } catch (error) {
      console.error("Error parsing message data:", error);
      return null;
    }
  }
}

export default Listener