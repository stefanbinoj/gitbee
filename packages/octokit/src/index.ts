import "dotenv/config";
import { App } from "octokit";
import { readFileSync } from "fs";

console.log("Initializing GitHub App with ID:", process.env.GH_APP_ID);
console.log("Webhook Secret:", process.env.GH_WEBHOOK_SECRET ? "✓" : "✗");

// Load private key from current directory (apps/bot when using bot:dev script)
const privateKey = readFileSync("private-key.pem", "utf8");
console.log("Private Key Loaded:", "✓");

export const app = new App({
  appId: process.env.GH_APP_ID!,
  privateKey: privateKey,
  webhooks: {
    secret: process.env.GH_WEBHOOK_SECRET!,
  },
});
