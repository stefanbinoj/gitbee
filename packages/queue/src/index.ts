import * as amqp from "amqplib";

export class QueueClient {
  private connection: any = null;
  private channel: any = null;

  constructor(private url: string = "amqp://localhost") { }

  async connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      amqp.connect(this.url, (error0: any, connection: any) => {
        if (error0) {
          reject(error0);
          return;
        }
        this.connection = connection;
        connection.createChannel((error1: any, channel: any) => {
          if (error1) {
            reject(error1);
            return;
          }
          this.channel = channel;
          resolve();
        });
      });
    });
  }

  async publish(queue: string, message: string): Promise<void> {
    if (!this.channel) throw new Error("Channel not connected");
    this.channel.assertQueue(queue, { durable: false });
    this.channel.sendToQueue(queue, Buffer.from(message));
  }

  async consume(
    queue: string,
    callback: (message: string) => void,
  ): Promise<void> {
    if (!this.channel) throw new Error("Channel not connected");
    this.channel.assertQueue(queue, { durable: false });
    this.channel.consume(
      queue,
      (msg: any) => {
        if (msg) {
          callback(msg.content.toString());
          this.channel!.ack(msg);
        }
      },
      { noAck: false },
    );
  }

  async close(): Promise<void> {
    if (this.channel) await this.channel.close();
    if (this.connection) await this.connection.close();
  }
}
