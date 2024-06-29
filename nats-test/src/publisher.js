import nats from "node-nats-streaming";

const stan = nats.connect("ticketing", "abc", {
  url: "http://localhost:4222",
});

stan.on("connect", () => {
  console.log("Publisher Connected to NATS");

  const data = JSON.stringify({
    title: "movie",
    price: 199,
    version: 1.0,
  });

  stan.publish("ticket:created", data, () => {
   console.log("Event Published");
  });
});
