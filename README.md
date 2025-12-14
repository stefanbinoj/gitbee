# GitBee

**Your friendly OSS moderation assistant.**

GitBee helps maintainers save hours every week by automating repetitive moderation tasks, keeping your open source community healthy and professional.

## Features

- **Issue Monitoring**: Get instant notifications (e.g., Slack) when new issues are created, so you can respond quickly.
- **PR Relevance Checking**: Automatically identify and close irrelevant or spam PRs. GitBee checks if contributions align with your project scope.
- **Conduct Enforcement**: Maintain professionalism with automated warnings. Users can be blocked after repeated violations of community guidelines.
- **Discussion Moderation**: Help new users with their queries and guide them through the process with professionalism.
- **Integrations**: Connect with GitHub, Slack, Jira, Linear, and more.

## Tech Stack
# hi
This project is built as a monorepo using [Turborepo](https://turborepo.com/).

- **Next.js**: The React framework for the web application.
- **ElysiaJS**: Fast, and friendly Bun web framework for the bot/backend.
- **OpenRouter**: Unified interface for LLMs.
- **Drizzle**: TypeScript ORM for interacting with the database.
- **LanceDB**: Vector database for semantic search and AI features.
- **AI SDK**: The TypeScript library for building AI-powered applications.
- **LangGraph**: Framework for building stateful, multi-actor applications with LLMs.
- **Better Auth**: Comprehensive authentication library.
- **LangFuse**: Open source LLM engineering platform for observability and analytics.

## Getting Started

1. Clone the repository: `git clone https://github.com/stefanbinoj/gitbee.git`
2. Install dependencies: `npm install` (or `pnpm install` / `yarn`)
3. Run the development server: `npm run dev`

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details on how to get started.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
