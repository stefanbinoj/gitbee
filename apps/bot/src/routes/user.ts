import { Elysia, status, t } from "elysia";
import {
  db,
  reportSchema,
  installationSchema,
  settingsSchema,
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
              eq(installationSchema.isRemoved, false)
            )
          )
          .orderBy(desc(installationSchema.createdAt));

        if (userInstallations.length === 0) {
          return { reports: [] };
        }

        const installationIds = userInstallations.map(
          (inst) => inst.installationId
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
    }
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
              eq(installationSchema.isRemoved, false)
            )
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
    }
  )
  .get(
    "/settings/:githubAccountId",
    async ({ params }) => {
      const { githubAccountId } = params;

      const accountId = parseInt(githubAccountId, 10);

      if (isNaN(accountId)) {
        return { error: "Invalid GitHub account ID" };
      }

      try {
        // Get the user's installation
        const userInstallation = await db
          .select({ targetId: installationSchema.targetId })
          .from(installationSchema)
          .where(
            and(
              eq(installationSchema.senderId, accountId),
              eq(installationSchema.isRemoved, false)
            )
          )
          .limit(1);

        if (userInstallation.length === 0) {
          return { error: "No installation found" };
        }

        const targetId = userInstallation[0].targetId;

        // Get settings for this installation
        const settings = await db
          .select()
          .from(settingsSchema)
          .where(eq(settingsSchema.targetId, targetId))
          .limit(1);

        if (settings.length === 0) {
          // Return default settings if none exist
          console.log("No settings found for installation", targetId);
          return {
            settings: {
              autoAssign: false,
              blockUser: true,
              autoCloseIrrelevantIssues: true,
              autoCloseIrrelevantPRs: true,
              reviewCommentsForPRs: false,
              strictness: "medium",
              responseTone: "friendly",
              moderateMembers: false,
              warningCount: 0,
            },
          };
        }

        return { settings: settings[0] };
      } catch (error) {
        console.error("Error fetching settings:", error);
        return { error: "Failed to fetch settings" };
      }
    },
    {
      params: t.Object({
        githubAccountId: t.String(),
      }),
    }
  )
  .put(
    "/settings/:githubAccountId",
    async ({ params, body }) => {
      const { githubAccountId } = params;

      const accountId = parseInt(githubAccountId, 10);

      if (isNaN(accountId)) {
        return { error: "Invalid GitHub account ID" };
      }

      try {
        // Get the user's installation
        const userInstallation = await db
          .select({ targetId: installationSchema.targetId })
          .from(installationSchema)
          .where(
            and(
              eq(installationSchema.senderId, accountId),
              eq(installationSchema.isRemoved, false)
            )
          )
          .limit(1);

        if (userInstallation.length === 0) {
          return { error: "No installation found" };
        }

        const targetId = userInstallation[0].targetId;

        // Check if settings exist
        const existingSettings = await db
          .select()
          .from(settingsSchema)
          .where(eq(settingsSchema.targetId, targetId))
          .limit(1);

        if (existingSettings.length === 0) {
          // Create new settings
          const newSettings = await db.insert(settingsSchema).values({
            targetId,
            ...body,
            updatedAt: new Date(),
          });

          return status(201);
        }

        // Update existing settings
        const updatedSettings = await db
          .update(settingsSchema)
          .set({
            ...body,
            updatedAt: new Date(),
          })
          .where(eq(settingsSchema.targetId, targetId));

        return status(201);
      } catch (error) {
        console.error("Error updating settings:", error);
        return status(500);
      }
    },
    {
      params: t.Object({
        githubAccountId: t.String(),
      }),
      body: t.Object({
        autoAssign: t.Optional(t.Boolean()),
        blockUser: t.Optional(t.Boolean()),
        autoCloseIrrelevantIssues: t.Optional(t.Boolean()),
        autoCloseIrrelevantPRs: t.Optional(t.Boolean()),
        reviewCommentsForPRs: t.Optional(t.Boolean()),
        strictness: t.Optional(
          t.Union([t.Literal("low"), t.Literal("medium"), t.Literal("high")])
        ),
        responseTone: t.Optional(
          t.Union([t.Literal("professional"), t.Literal("friendly")])
        ),
        moderateMembers: t.Optional(t.Boolean()),
        warningCount: t.Optional(t.Number()),
      }),
    }
  );
