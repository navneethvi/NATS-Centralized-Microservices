class Publisher {
    constructor(client) {
      this.client = client;
      this.subject;
    }
  
    publish(data) {
      return new Promise((resolve, reject) => {
        this.client.publish(this.subject, JSON.stringify(data), (err) => {
          if (err) {
            return reject(err);
          }
          console.log("Published event:", this.subject);
          resolve();
        });
      });
    }
  }
  
  export default Publisher