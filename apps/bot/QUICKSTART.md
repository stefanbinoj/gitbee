# Quick Start Guide

This is a quick reference for setting up and running the GitHub bot. For detailed instructions, see [SETUP.md](SETUP.md).

## Prerequisites

- [Bun](https://bun.sh/) installed
- [ngrok](https://ngrok.com/) installed and configured
- GitHub account

## Quick Setup

### 1. Start ngrok tunnel
```bash
ngrok http 4000
```
Copy the forwarding URL (e.g., `https://abcd1234.ngrok.io`)

### 2. Create GitHub App

Go to [GitHub Apps Settings](https://github.com/settings/apps/new) and create a new app:

- **Webhook URL**: `https://YOUR-NGROK-URL.ngrok.io/api/webhook`
- **Webhook Secret**: Generate with `openssl rand -hex 20`
- **Permissions**: Issues (R&W), Pull requests (R&W), Discussions (R&W)
- **Events**: Subscribe to Issues, Issue comment, Pull request, Discussion, Discussion comment

### 3. Configure Bot

```bash
cd apps/bot

# Copy example files
cp .env.example .env

# Edit .env and add:
# - GH_APP_ID (from GitHub App settings)
# - GH_WEBHOOK_SECRET (the one you used when creating the app)

# Download private key from GitHub App settings and save as:
mv ~/Downloads/your-app.pem private-key.pem
```

### 4. Install App on Repository

In your GitHub App settings, click "Install App" and select repositories.

### 5. Run Bot

From repository root:
```bash
bun run dev:bot
```

Or from `apps/bot` directory:
```bash
bun run dev
```

## Verify It's Working

1. Create an issue in a repository where the app is installed
2. Check bot console for logs:
   ```
   Event received through webhook: issues
   Issue opened: Your Issue Title
   ```
3. Bot should comment on the issue automatically

## Common Commands

```bash
# Run bot from root
bun run dev:bot
# or
bun run bot:dev

# Run bot from apps/bot
cd apps/bot
bun run dev

# Check logs while running
# - Watch console output for webhook events
# - Check ngrok dashboard at http://localhost:4040

# Generate new webhook secret
openssl rand -hex 20
```

## Troubleshooting

**No webhooks received?**
- Verify ngrok is running
- Check webhook URL in GitHub App matches ngrok URL
- Check ngrok dashboard at http://localhost:4040

**Authentication errors?**
- Verify App ID in .env
- Check private-key.pem exists in apps/bot/
- Ensure webhook secret matches

**Port in use?**
- Change port in `src/index.ts` (default: 4000)
- Update ngrok command to match: `ngrok http NEW_PORT`

## Next Steps

- Read [SETUP.md](SETUP.md) for detailed setup instructions
- Customize webhook handlers in `src/botActions/index.ts`
- Add your own bot logic
