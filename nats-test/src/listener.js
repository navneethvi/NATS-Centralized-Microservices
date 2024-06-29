import nats from "node-nats-streaming";
import { randomBytes } from "crypto";

import TicketCreatedListener from "./events/ticket-created-sub.js";

const stan = nats.connect("ticketing", randomBytes(4).toString("hex"), {
  url: "http://localhost:4222",
});

stan.on("connect", () => {
  console.log("Listener Connected to NATS");

  stan.on("close", () => {
    console.log("NATS Connection closed");
    process.exit();
  });

  new TicketCreatedListener(stan).listen()

});
