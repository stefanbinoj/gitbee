import { Elysia, t } from "elysia";
import {
  db,
  reportSchema,
  installationSchema,
  eq,
  and,
  inArray,
  desc,
} from "@gitbee/db";

export const userRouter = new Elysia({ prefix: "/users" })
  .get(
    "/reports/:githubAccountId",
    async ({ params }) => {
      const { githubAccountId } = params;

      // Convert string to number since GitHub IDs are integers
      const accountId = parseInt(githubAccountId, 10);

      if (isNaN(accountId)) {
        return { error: "Invalid GitHub account ID" };
      }

      try {
        // Get all installations for this user
        const userInstallations = await db
          .select({ installationId: installationSchema.installationId })
          .from(installationSchema)
          .where(
            and(
              eq(installationSchema.senderId, accountId),
              eq(installationSchema.isRemoved, false),
            ),
          )
          .orderBy(desc(installationSchema.createdAt));

        if (userInstallations.length === 0) {
          return { reports: [] };
        }

        const installationIds = userInstallations.map(
          (inst) => inst.installationId,
        );

        // Get reports for these installations
        const reports = await db
          .select()
          .from(reportSchema)
          .where(inArray(reportSchema.installationId, installationIds))
          .orderBy(desc(reportSchema.createdAt));

        return { reports };
      } catch (error) {
        console.error("Error fetching user reports:", error);
        return { error: "Failed to fetch reports" };
      }
    },
    {
      params: t.Object({
        githubAccountId: t.String(),
      }),
    },
  )
  .get(
    "/installations/:githubAccountId",
    async ({ params }) => {
      const { githubAccountId } = params;

      // Convert string to number since GitHub IDs are integers
      const accountId = parseInt(githubAccountId, 10);

      if (isNaN(accountId)) {
        return { error: "Invalid GitHub account ID" };
      }

      try {
        // Get all installations for this user
        const userInstallations = await db
          .select()
          .from(installationSchema)
          .where(
            and(
              eq(installationSchema.senderId, accountId),
              eq(installationSchema.isRemoved, false),
            ),
          );

        return {
          isInstalled: userInstallations.length > 0,
          installations: userInstallations,
        };
      } catch (error) {
        console.error("Error fetching user installations:", error);
        return { error: "Failed to fetch installations" };
      }
    },
    {
      params: t.Object({
        githubAccountId: t.String(),
      }),
    },
  );
