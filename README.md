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

This project is built as a monorepo using [Turborepo](https://turborepo.com/).

- **Web**: Next.js application
- **Docs**: Next.js documentation site
- **Bot**: The core moderation bot logic

## Getting Started

1. Clone the repository: `git clone https://github.com/stefanbinoj/gitbee.git`
2. Install dependencies: `npm install` (or `pnpm install` / `yarn`)
3. Run the development server: `npm run dev`

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details on how to get started.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
