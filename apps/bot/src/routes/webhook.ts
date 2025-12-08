import { Elysia } from "elysia";
import { app } from "@gitbee/octokit";

export const webhookRouter = new Elysia({ prefix: "/webhook" }).post(
  "/",
  async ({ request, headers }) => {
    try {
      const rawBody = await request.text();

      const event = headers["x-github-event"];
      const signature = headers["x-hub-signature-256"];
      const identity = headers["x-github-delivery"];

      console.log("Raw Body:", rawBody);
      console.log("Event recieved through webhook:", event);

      await app.webhooks.verifyAndReceive({
        id: identity as string,
        name: event as string,
        payload: rawBody,
        signature: signature as string,
      });
    } catch (error) {
      console.error("Error processing webhook:", error);
    }
  },
);
