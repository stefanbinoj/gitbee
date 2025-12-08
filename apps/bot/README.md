# GitBee Bot

A GitHub App bot built with Bun and Elysia that responds to GitHub webhook events for issues, pull requests, and discussions.

## Documentation

- **[QUICKSTART.md](QUICKSTART.md)** - Quick reference guide for rapid setup
- **[SETUP.md](SETUP.md)** - Comprehensive setup guide with detailed instructions
- **[TROUBLESHOOTING.md](TROUBLESHOOTING.md)** - Troubleshooting checklist and common issues

## Quick Start

```bash
# From repository root
bun run dev:bot

# Or from this directory
bun run dev
```

See [QUICKSTART.md](QUICKSTART.md) for setup instructions.

## What it does

This bot automatically responds to GitHub events:

- **Issues**: Posts a welcome comment when issues are opened
- **Pull Requests**: Logs PR events (open, edit, reopen)
- **Discussions**: Logs discussion events
- **Comments**: Logs comment events on issues and discussions

## Configuration

1. Copy `.env.example` to `.env`
2. Fill in your GitHub App credentials:
   - `GH_APP_ID` - Your GitHub App ID
   - `GH_WEBHOOK_SECRET` - Webhook secret from GitHub App settings
3. Add your `private-key.pem` file to this directory

## Local Development with ngrok

The bot requires a public URL to receive GitHub webhooks. Use ngrok for local development:

```bash
# In one terminal
ngrok http 4000

# In another terminal
bun run dev:bot
```

Update your GitHub App's webhook URL to the ngrok forwarding URL.

See [SETUP.md](SETUP.md) for complete setup instructions.

## Project Structure

```
apps/bot/
├── src/
│   ├── index.ts          # Main server entry point
│   ├── botActions/       # Webhook event handlers
│   │   └── index.ts      # Event handler definitions
│   └── routes/           # API routes
│       ├── webhook.ts    # Webhook endpoint
│       ├── user.ts       # User routes
│       └── todo.ts       # Todo routes
├── .env.example          # Environment variables template
├── .private-key.pem.example  # Private key template
└── package.json
```

## Customizing Bot Behavior

Edit `src/botActions/index.ts` to add or modify webhook event handlers:

```typescript
app.webhooks.on("issues.opened", async ({ octokit, payload }) => {
  // Your custom logic here
  await octokit.rest.issues.createComment({
    owner: payload.repository.owner.login,
    repo: payload.repository.name,
    issue_number: payload.issue.number,
    body: "Your custom message!",
  });
});
```

## Available Scripts

- `bun run dev` - Start development server with hot reload
- `bun run test` - Run tests (not yet implemented)

## Tech Stack

- **Runtime**: [Bun](https://bun.sh/)
- **Framework**: [Elysia](https://elysiajs.com/)
- **GitHub API**: [Octokit](https://github.com/octokit/octokit.js)

## Need Help?

1. Check [TROUBLESHOOTING.md](TROUBLESHOOTING.md) for common issues
2. Review [SETUP.md](SETUP.md) for detailed setup steps
3. Verify your configuration matches the requirements
