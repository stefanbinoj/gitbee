# Bot Setup Troubleshooting Checklist

Use this checklist to verify your bot setup is correct.

## Pre-flight Checklist

### Environment Setup
- [ ] Bun is installed (`bun --version` works)
- [ ] ngrok is installed and authenticated
- [ ] Repository dependencies installed (`bun install` completed successfully)

### ngrok Configuration
- [ ] ngrok is running (`ngrok http 4000`)
- [ ] ngrok forwarding URL copied (looks like `https://xyz123.ngrok.io`)
- [ ] ngrok web interface accessible at `http://localhost:4040`

### GitHub App Configuration
- [ ] GitHub App created at https://github.com/settings/apps
- [ ] Webhook URL set to `https://YOUR-NGROK-URL/api/webhook`
- [ ] Webhook secret generated and saved
- [ ] App ID noted from app settings page
- [ ] Private key generated and downloaded

### Permissions Set
- [ ] Issues: Read & Write
- [ ] Pull requests: Read & Write  
- [ ] Discussions: Read & Write
- [ ] Metadata: Read-only (auto-required)

### Webhook Events Subscribed
- [ ] Issues
- [ ] Issue comment
- [ ] Pull request
- [ ] Discussion
- [ ] Discussion comment

### Local Configuration Files
- [ ] `.env` file exists in `apps/bot/` (not `.env.example`)
- [ ] `GH_APP_ID` is set in `.env`
- [ ] `GH_WEBHOOK_SECRET` is set in `.env`
- [ ] `private-key.pem` file exists in `apps/bot/`
- [ ] `private-key.pem` starts with `-----BEGIN RSA PRIVATE KEY-----`

### App Installation
- [ ] GitHub App installed on at least one repository
- [ ] Correct repositories selected during installation

## Runtime Checklist

### Starting the Bot
- [ ] ngrok is running in one terminal
- [ ] Bot starts without errors (`bun run dev:bot`)
- [ ] Console shows initialization messages:
  ```
  Initializing GitHub App with ID: [your-app-id]
  Webhook Secret: ✓
  Private Key Loaded: ✓
  🦊 Elysia is running at localhost:4000
  ```

### Testing Webhooks
- [ ] Create a test issue in an installed repository
- [ ] Bot console shows webhook received:
  ```
  Event received through webhook: issues
  Issue opened: [issue title]
  ```
- [ ] Bot posts comment on the issue automatically
- [ ] ngrok web interface shows webhook requests at `http://localhost:4040`

## Common Issues

### Bot doesn't start

**Error: Cannot find module 'dotenv'**
- Solution: Run `bun install` from repository root

**Error: Cannot find module 'private-key.pem'**
- Solution: Ensure `private-key.pem` is in `apps/bot/` directory
- Solution: Check file name is exactly `private-key.pem` (not `.pem.example`)

**Error: EADDRINUSE (port already in use)**
- Solution: Change port in `apps/bot/src/index.ts`
- Solution: Update ngrok command to match new port

### No webhooks received

**Check ngrok**
- Is ngrok running? Check terminal
- Visit `http://localhost:4040` - do you see webhook requests?
- If yes, requests shown but bot not receiving → check webhook URL in GitHub App

**Check GitHub App Settings**
- Does webhook URL match current ngrok URL?
- Remember: ngrok URL changes on restart (free tier)
- Update webhook URL in GitHub App when ngrok restarts

**Check Webhook Secret**
- Does secret in `.env` match GitHub App settings?
- No spaces or quotes in the secret value

### Authentication Errors

**Error: GitHub App authentication failed**
- Verify `GH_APP_ID` in `.env` matches GitHub App settings
- Check `private-key.pem` format (should be PEM format)
- Ensure private key is from the correct GitHub App

**Error: Webhook signature verification failed**
- Webhook secret mismatch
- Update `GH_WEBHOOK_SECRET` in `.env` to match GitHub App
- Or update GitHub App webhook secret to match `.env`

### Bot receives webhooks but doesn't respond

**No comment posted on issues**
- Check bot console for errors
- Verify bot has "Write" permission for Issues
- Verify repository is included in app installation

**Events logged but no action**
- Check `apps/bot/src/botActions/index.ts` for webhook handlers
- Verify the event handler exists for the event type
- Check for errors in bot console

## Verification Commands

```bash
# Check if bun is installed
bun --version

# Check if .env exists
ls -la apps/bot/.env

# Check if private key exists
ls -la apps/bot/private-key.pem

# Check environment variables (from apps/bot directory)
cd apps/bot && cat .env

# Test ngrok is working
curl https://YOUR-NGROK-URL.ngrok.io/api/webhook

# View ngrok requests
open http://localhost:4040

# Start bot with verbose logging
cd apps/bot && bun run dev
```

## Still Having Issues?

1. Check the detailed setup guide: [SETUP.md](SETUP.md)
2. Review the quick start: [QUICKSTART.md](QUICKSTART.md)
3. Verify each step was completed in order
4. Check ngrok dashboard for incoming requests
5. Review bot console output for error messages
6. Ensure GitHub App is installed on the correct repositories
