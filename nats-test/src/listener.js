import nats from "node-nats-streaming";
import { randomBytes } from "crypto";

const stan = nats.connect("ticketing", randomBytes(4).toString("hex"), {
  url: "http://localhost:4222",
});

stan.on("connect", () => {
  console.log("Listener Connected to NATS");

  stan.on("close", () => {
    console.log("NATS Connection closed");
    process.exit();
  });

  const options = stan
    .subscriptionOptions()
    .setManualAckMode(true)
    .setDeliverAllAvailable()
    .setDurableName("nv");

  const subscription = stan.subscribe("ticket:created", "listenerQueueGroup", options);

  subscription.on("message", (msg) => {
    const data = msg.getData();
    if (typeof data === "string") {
      console.log(
        `Message Recieved #${msg.getSequence()}, with data : ${data}`
      );
    }
    msg.ack();
  });
});
