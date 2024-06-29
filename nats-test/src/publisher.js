import nats from "node-nats-streaming";

import TicketCreatedPublisher from "./events/ticket-created-pub.js";

const stan = nats.connect("ticketing", "abc", {
  url: "http://localhost:4222",
});

stan.on("connect", async () => {
  try {
    console.log("Publisher Connected to NATS");

    const data = JSON.stringify({
      title: "movie",
      price: 199,
      version: 2.0,
    });

    const pub = new TicketCreatedPublisher(stan);
    await pub.publish(data);
  } catch (error) {
    console.log(error.message);
  }
});
