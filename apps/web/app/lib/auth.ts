import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db, account as accountTable } from "@gitbee/db";
import { eq, and } from "drizzle-orm";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
  },
  session: {
    additionalFields: {
      githubAccountId: {
        type: "number",
        nullable: true,
      },
    },
  },
  databaseHooks: {
    session: {
      create: {
        before: async (session) => {
          // Fetch the GitHub account ID for this user
          const githubAccount = await db
            .select({ accountId: accountTable.accountId })
            .from(accountTable)
            .where(
              and(
                eq(accountTable.userId, session.userId),
                eq(accountTable.providerId, "github")
              )
            )
            .limit(1);

          const accountId = githubAccount[0]?.accountId;

          return {
            data: {
              ...session,
              githubAccountId: accountId ? parseInt(accountId, 10) : null,
            },
          };
        },
      },
    },
  },
});
