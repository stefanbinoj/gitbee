import "dotenv/config";
import { App } from "octokit";

export const app = new App({
  appId: process.env.GH_APP_ID!,
  privateKey: process.env.GH_PRIVATE_KEY!,
  webhooks: {
    secret: process.env.GH_WEBHOOK_SECRET!,
  },
});
