import nats from "node-nats-streaming";

class NatsWrapper {
  constructor() {
    this.client = null;
  }

  connect(clusterId, clientId, url) {
    return new Promise((resolve, reject) => {
      const MAX_RETRIES = 5;
      let retries = 0;
      const tryConnect = () => {
        this.client = nats.connect(clusterId, clientId, { url });

        this.client.on("connect", () => {
          console.log("NATS Connected");
          resolve();
        });

        this.client.on("error", (error) => {
          console.error("NATS Connection Error", error.message);
          retries++;
          if (retries >= MAX_RETRIES) {
            reject(new Error("Max Retries Reached. Unable to connect NATS"));
          } else {
            setTimeout(tryConnect, 5000);
          }
        });
      };
      tryConnect();
    });
  }

  getClient() {
    if (this.client) {
      return this.client;
    }
    console.log("Client is not ready!!!");
    return;
  }
}

const natsWrapper = new NatsWrapper();

export default natsWrapper;
