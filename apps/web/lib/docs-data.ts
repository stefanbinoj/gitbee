export type Doc = {
  id: number;
  title: string;
  slug: string;
  category: string;
  readTime: string;
  popular: boolean;
  content: string;
};

export const docs: Doc[] = [
  {
    id: 1,
    title: "Getting Started with GitBee",
    slug: "getting-started",
    category: "Guides",
    readTime: "5 min",
    popular: true,
    content: `
# Getting Started with GitBee

Welcome to GitBee! This guide will help you get up and running with our platform.

## Prerequisites
- A GitHub account
- Administrator access to the repositories you want to manage

## Step 1: Installation
Install the GitBee GitHub App on your organization or personal account.

## Step 2: Configuration
Navigate to the dashboard to configure your initial settings.
    `,
  },
  {
    id: 2,
    title: "Configuring Auto-Response Rules",
    slug: "auto-response-rules",
    category: "Configuration",
    readTime: "8 min",
    popular: true,
    content: `
# Configuring Auto-Response Rules

Auto-response rules allow you to automate interactions on issues and pull requests.

## Creating a Rule
1. Go to Settings > Rules
2. Click "New Rule"
3. Define your triggers and actions

## Best Practices
- Keep responses friendly and professional
- Use conditions to avoid spamming
    `,
  },
  {
    id: 3,
    title: "Integrating with Slack",
    slug: "slack-integration",
    category: "Integrations",
    readTime: "4 min",
    popular: false,
    content: `
# Integrating with Slack

Connect GitBee to your Slack workspace to receive real-time notifications.

## Setup
1. Go to Integrations
2. Click "Connect Slack"
3. Authorize the GitBee bot
    `,
  },
  {
    id: 4,
    title: "Understanding PR Analysis Reports",
    slug: "pr-analysis-reports",
    category: "Features",
    readTime: "6 min",
    popular: true,
    content: `
# Understanding PR Analysis Reports

GitBee analyzes your Pull Requests to provide insights on code quality and security.

## Report Sections
- **Summary**: High-level overview
- **Code Quality**: Linting and complexity metrics
- **Security**: Vulnerability scan results
    `,
  },
  {
    id: 5,
    title: "Managing User Permissions",
    slug: "user-permissions",
    category: "Administration",
    readTime: "3 min",
    popular: false,
    content: `
# Managing User Permissions

Control who has access to your GitBee dashboard and settings.

## Roles
- **Admin**: Full access
- **Editor**: Can modify settings
- **Viewer**: Read-only access
    `,
  },
  {
    id: 6,
    title: "API Reference",
    slug: "api-reference",
    category: "Developer",
    readTime: "15 min",
    popular: false,
    content: `
# API Reference

GitBee provides a REST API for programmatic access to your data.

## Authentication
Use your API key in the \`Authorization\` header:
\`\`\`
Authorization: Bearer YOUR_API_KEY
\`\`\`

## Endpoints
- \`GET /api/v1/projects\`
- \`GET /api/v1/reports\`
    `,
  },
];
