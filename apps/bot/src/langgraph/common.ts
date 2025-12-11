import { aiClient } from "@gitbee/ai";

// Types
interface GitHubUser {
  login: string;
  created_at: string;
  public_repos: number;
  followers: number;
  following: number;
}

interface GitHubRepo {
  stargazers_count: number;
  forks_count: number;
  fork: boolean;
}

interface UserMetrics {
  username: string;
  accountAgeYears: number;
  publicRepos: number;
  followers: number;
  following: number;
  totalStars: number;
  totalForks: number;
  ownRepoCount: number;
}

export interface ExperienceResult {
  level: "beginner" | "intermediate" | "experienced";
  confidence: number;
  reasoning: string;
  metrics: UserMetrics;
}

const SYSTEM_PROMPT = `You are a GitHub user experience analyzer. Based on the provided metrics, classify the user's experience level.

Guidelines:
- beginner: New to GitHub (<1 year), few repos (<5), minimal community engagement
- intermediate: Some experience (1-3 years), moderate activity (5-20 repos), growing presence
- experienced: Established presence (>3 years), significant contributions (>20 repos), strong community engagement (>100 stars/followers)

Consider the overall picture, not just individual metrics.
Respond ONLY with valid JSON in this exact format (no markdown, no extra text):
{"level": "beginner", "confidence": 0.85, "reasoning": "brief explanation"}`;

async function fetchGitHubUser(username: string): Promise<GitHubUser> {
  const res = await fetch(`https://api.github.com/users/${username}`, {
    headers: { Accept: "application/vnd.github.v3+json" },
  });
  if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
  return res.json();
}

async function fetchGitHubRepos(username: string): Promise<GitHubRepo[]> {
  const res = await fetch(
    `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`,
    {
      headers: { Accept: "application/vnd.github.v3+json" },
    },
  );
  if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
  return res.json();
}

function calculateMetrics(user: GitHubUser, repos: GitHubRepo[]): UserMetrics {
  const accountAgeYears =
    (Date.now() - new Date(user.created_at).getTime()) /
    (1000 * 60 * 60 * 24 * 365);
  const ownRepos = repos.filter((r) => !r.fork);

  return {
    username: user.login,
    accountAgeYears: Math.round(accountAgeYears * 10) / 10,
    publicRepos: user.public_repos,
    followers: user.followers,
    following: user.following,
    totalStars: repos.reduce((sum, r) => sum + r.stargazers_count, 0),
    totalForks: repos.reduce((sum, r) => sum + r.forks_count, 0),
    ownRepoCount: ownRepos.length,
  };
}

export async function analyzeUserExperience(
  username: string,
): Promise<ExperienceResult> {
  // Fetch GitHub data in parallel
  const [user, repos] = await Promise.all([
    fetchGitHubUser(username),
    fetchGitHubRepos(username),
  ]);

  const metrics = calculateMetrics(user, repos);

  // Build prompt with metrics
  const prompt = `Analyze this GitHub user's experience level:
- Username: ${metrics.username}
- Account age: ${metrics.accountAgeYears} years
- Public repos: ${metrics.publicRepos} (${metrics.ownRepoCount} non-forked)
- Total stars received: ${metrics.totalStars}
- Total forks received: ${metrics.totalForks}
- Followers: ${metrics.followers}
- Following: ${metrics.following}`;

  // Pass undefined for outputSchema to avoid AI SDK output parsing issues
  const response = await aiClient(
    "openai/gpt-4o-mini",
    prompt,
    SYSTEM_PROMPT,
    undefined,
  );

  // Parse JSON from text response
  const text = response.text.trim();
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("Failed to parse LLM response as JSON");
  }

  const result = JSON.parse(jsonMatch[0]) as {
    level: "beginner" | "intermediate" | "experienced";
    confidence: number;
    reasoning: string;
  };
  console.log("LLM Response:", result);

  return {
    level: result.level,
    confidence: result.confidence,
    reasoning: result.reasoning,
    metrics,
  };
}

