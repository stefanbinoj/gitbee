# GitHub Bot Setup Guide

This guide will help you set up the GitHub bot with ngrok tunneling for local development.

## Prerequisites

- [Bun](https://bun.sh/) installed on your system
- [ngrok](https://ngrok.com/) account and CLI installed
- GitHub account with permissions to create GitHub Apps

## Step 1: Install Dependencies

From the root of the repository, install all dependencies:

```bash
bun install
```

## Step 2: Set Up ngrok Tunnel

1. If you haven't already, sign up for ngrok at [https://ngrok.com/](https://ngrok.com/)

2. Install ngrok CLI:
   ```bash
   # On macOS
   brew install ngrok
   
   # On Linux
   curl -s https://ngrok-agent.s3.amazonaws.com/ngrok.asc | sudo tee /etc/apt/trusted.gpg.d/ngrok.asc >/dev/null
   echo "deb https://ngrok-agent.s3.amazonaws.com buster main" | sudo tee /etc/apt/sources.list.d/ngrok.list
   sudo apt update && sudo apt install ngrok
   
   # On Windows
   # Download from https://ngrok.com/download
   ```

3. Authenticate ngrok with your auth token:
   ```bash
   ngrok config add-authtoken YOUR_AUTH_TOKEN
   ```

4. Start ngrok tunnel for port 4000 (the bot runs on port 4000):
   ```bash
   ngrok http 4000
   ```

5. Copy the forwarding URL from ngrok output (e.g., `https://abcd1234.ngrok.io`)

## Step 3: Create GitHub App

1. Go to GitHub Settings → Developer settings → GitHub Apps → [New GitHub App](https://github.com/settings/apps/new)

2. Fill in the required information:
   - **GitHub App name**: Choose a unique name (e.g., "My GitBee Bot")
   - **Homepage URL**: Use your ngrok URL (e.g., `https://abcd1234.ngrok.io`)
   - **Webhook URL**: Use your ngrok URL with the webhook path: `https://abcd1234.ngrok.io/api/webhook`
   - **Webhook secret**: Generate a secure random string (you can use `openssl rand -hex 20`)

3. Set the following **Repository permissions**:
   - **Issues**: Read & Write
   - **Pull requests**: Read & Write
   - **Discussions**: Read & Write
   - **Metadata**: Read-only (automatically required)

4. Subscribe to the following **events**:
   - Issues
   - Issue comment
   - Pull request
   - Discussion
   - Discussion comment

5. Choose **Where can this GitHub App be installed?**:
   - Select "Only on this account" for testing

6. Click **Create GitHub App**

## Step 4: Configure GitHub App Credentials

1. After creating the app, note down the **App ID** from the app settings page

2. Generate a private key:
   - Scroll down to "Private keys" section
   - Click "Generate a private key"
   - A `.pem` file will be downloaded to your computer

3. Set up environment variables:
   - Navigate to `apps/bot` directory:
     ```bash
     cd apps/bot
     ```
   
   - Copy the example environment file:
     ```bash
     cp .env.example .env
     ```
   
   - Edit `.env` file and fill in your values:
     ```
     GH_APP_ID=123456
     GH_WEBHOOK_SECRET=your_webhook_secret_here
     ```

4. Add your private key:
   - Rename the downloaded `.pem` file to `private-key.pem`
   - Move it to the `apps/bot` directory:
     ```bash
     mv ~/Downloads/your-app-name.YYYY-MM-DD.private-key.pem apps/bot/private-key.pem
     ```
   
   Note: The `.pem` file is already in `.gitignore` and won't be committed to the repository.

## Step 5: Install the GitHub App on a Repository

1. Go to your GitHub App settings page
2. Click "Install App" in the left sidebar
3. Choose the account/organization where you want to install it
4. Select the repositories you want to give the app access to
5. Click "Install"

## Step 6: Run the Bot

You can run the bot in two ways:

### Option 1: From the root directory
```bash
bun run dev:bot
# or
bun run bot:dev
```

### Option 2: From the apps/bot directory
```bash
cd apps/bot
bun run dev
```

The bot should now be running at `http://localhost:4000` and accessible via your ngrok URL.

## Step 7: Verify Setup

1. Check the console output for initialization logs:
   ```
   Initializing GitHub App with ID: 123456
   Webhook Secret: ✓
   Private Key Loaded: ✓
   🦊 Elysia is running at localhost:4000
   ```

2. Test the webhook by creating an issue in one of your repositories where the app is installed

3. Check the bot logs for webhook events:
   ```
   Event received through webhook: issues
   Issue opened: Your Issue Title
   ```

4. The bot should automatically post a comment on the issue saying:
   ```
   Thanks for opening this issue! A maintainer will review it soon.
   ```

## Troubleshooting

For a comprehensive troubleshooting checklist, see [TROUBLESHOOTING.md](TROUBLESHOOTING.md).

### Bot not receiving webhooks

1. Check that ngrok is running and the URL is correct in GitHub App settings
2. Verify the webhook secret matches in both `.env` and GitHub App settings
3. Check ngrok web interface at `http://localhost:4040` to see incoming requests

### Authentication errors

1. Verify the App ID is correct in `.env`
2. Make sure the `private-key.pem` file is in the `apps/bot` directory
3. Check that the private key file has the correct format (should start with `-----BEGIN RSA PRIVATE KEY-----`)

### Port already in use

If port 4000 is already in use, you can change the port in `apps/bot/src/index.ts`:
```typescript
const app = new Elysia().use(apiRouter).listen(4000); // Change to your desired port
```

Remember to update your ngrok tunnel to use the new port:
```bash
ngrok http NEW_PORT
```

## Development Workflow

1. Keep ngrok running in a terminal
2. Run the bot with `bun run dev:bot` (from root) or `bun run dev` (from apps/bot)
3. Make changes to the code - the bot will automatically reload thanks to the `--watch` flag
4. Test your changes by triggering events in your GitHub repository

## Notes

- The ngrok URL changes every time you restart ngrok (unless you have a paid plan with reserved domains)
- When the ngrok URL changes, you need to update the Webhook URL in your GitHub App settings
- The bot uses hot reload, so code changes are reflected immediately without restarting
