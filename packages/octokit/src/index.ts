import "dotenv/config";
import { App } from "octokit";
import { readFileSync } from "fs";

console.log("Initializing GitHub App with ID:", process.env.GH_APP_ID);
console.log("Webhook Secret:", process.env.GH_WEBHOOK_SECRET ? "✓" : "✗");

// Load private key from current directory (apps/bot when using bot:dev script)
let privateKey: string;
try {
  privateKey = readFileSync("private-key.pem", "utf8");
  console.log("Private Key Loaded:", "✓");
} catch (error) {
  console.error("❌ Error: Could not read private-key.pem file");
  console.error("Make sure the private-key.pem file exists in the apps/bot directory");
  console.error("See SETUP.md for instructions on how to generate and download your private key");
  process.exit(1);
}

export const app = new App({
  appId: process.env.GH_APP_ID!,
  privateKey: privateKey,
  webhooks: {
    secret: process.env.GH_WEBHOOK_SECRET!,
  },
});
