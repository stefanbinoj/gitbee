import { Elysia, status } from "elysia";
import { app } from "@gitbee/octokit";

export const webhookRouter = new Elysia({ prefix: "/webhook" }).post(
  "/",
  async ({ request, headers }) => {
    try {
      const rawBody = await request.text();
      const jsonBody = JSON.parse(rawBody);

      const event = headers["x-github-event"];
      const signature = headers["x-hub-signature-256"];
      const identity = headers["x-github-delivery"];

      // console.log("Raw Body:", jsonBody);
      console.log("Event recieved through webhook:", event);

      await app.webhooks.verifyAndReceive({
        id: identity as string,
        name: event as string,
        payload: rawBody,
        signature: signature as string,
      });

      return status(200)
    } catch (error) {
      console.error("Error processing webhook:", error);
      return status(500)
    }
  },
);
