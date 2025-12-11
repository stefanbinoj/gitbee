import { Elysia, t } from "elysia";
import {
  db,
  reportSchema,
  installationSchema,
  installationRepositoriesSchema,
} from "@gitbee/db";
import { eq, and, inArray, desc, getTableColumns } from "drizzle-orm";

export const userRouter = new Elysia({ prefix: "/users" }).get(
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
            eq(installationSchema.isRemoved, false)
          )
        );

      if (userInstallations.length === 0) {
        return { reports: [] };
      }

      const installationIds = userInstallations.map(
        (inst) => inst.installationId
      );

      // Get reports for these installations
      const reports = await db
        .select({
          ...getTableColumns(reportSchema),
          repositoryFullName: installationRepositoriesSchema.repositoryFullName,
        })
        .from(reportSchema)
        .leftJoin(
          installationRepositoriesSchema,
          eq(
            reportSchema.repositoryId,
            installationRepositoriesSchema.repositoryId
          )
        )
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
  }
);
