import { Elysia, status, t } from "elysia";
import {
  db,
  reportSchema,
  installationSchema,
  installationRepositoriesSchema,
  settingsSchema,
  warningSchema,
  rulesSchema,
  eq,
  and,
  inArray,
  desc,
  gte,
  lt,
  count,
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
              eq(installationSchema.isRemoved, false),
            ),
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
    },
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
              eq(installationSchema.isRemoved, false),
            ),
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
          t.Union([t.Literal("low"), t.Literal("medium"), t.Literal("high")]),
        ),
        responseTone: t.Optional(
          t.Union([t.Literal("professional"), t.Literal("friendly")]),
        ),
        moderateMembers: t.Optional(t.Boolean()),
        warningCount: t.Optional(t.Number()),
      }),
    },
  )
  .get(
    "/warnings/:githubAccountId",
    async ({ params }) => {
      const { githubAccountId } = params;

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
          );

        if (userInstallations.length === 0) {
          return { warnings: [] };
        }

        const installationIds = userInstallations.map(
          (inst) => inst.installationId,
        );

        // Get warnings for these installations
        const warnings = await db
          .select()
          .from(warningSchema)
          .where(inArray(warningSchema.installationId, installationIds))
          .orderBy(desc(warningSchema.createdAt));

        return { warnings };
      } catch (error) {
        console.error("Error fetching warnings:", error);
        return { error: "Failed to fetch warnings" };
      }
    },
    {
      params: t.Object({
        githubAccountId: t.String(),
      }),
    },
  )
  // Rules CRUD endpoints
  .get(
    "/rules/:githubAccountId",
    async ({ params }) => {
      const { githubAccountId } = params;

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
          );

        if (userInstallations.length === 0) {
          return { rules: [] };
        }

        const installationIds = userInstallations.map(
          (inst) => inst.installationId,
        );

        // Get rules for these installations
        const rules = await db
          .select()
          .from(rulesSchema)
          .where(inArray(rulesSchema.installationId, installationIds))
          .orderBy(desc(rulesSchema.createdAt));

        return { rules };
      } catch (error) {
        console.error("Error fetching rules:", error);
        return { error: "Failed to fetch rules" };
      }
    },
    {
      params: t.Object({
        githubAccountId: t.String(),
      }),
    },
  )
  .post(
    "/rules/:githubAccountId",
    async ({ params, body }) => {
      const { githubAccountId } = params;

      const accountId = parseInt(githubAccountId, 10);

      if (isNaN(accountId)) {
        return { error: "Invalid GitHub account ID" };
      }

      try {
        // Get the user's installation
        const userInstallation = await db
          .select({ installationId: installationSchema.installationId })
          .from(installationSchema)
          .where(
            and(
              eq(installationSchema.senderId, accountId),
              eq(installationSchema.isRemoved, false),
            ),
          )
          .limit(1);

        if (userInstallation.length === 0) {
          return { error: "No installation found" };
        }

        const installationId = userInstallation[0].installationId;

        // Create the rule
        const [newRule] = await db
          .insert(rulesSchema)
          .values({
            installationId,
            ruleType: body.ruleType,
            ruleName: body.ruleName,
            ruleText: body.ruleText,
          })
          .returning();

        return { rule: newRule };
      } catch (error) {
        console.error("Error creating rule:", error);
        return { error: "Failed to create rule" };
      }
    },
    {
      params: t.Object({
        githubAccountId: t.String(),
      }),
      body: t.Object({
        ruleType: t.Union([
          t.Literal("comment"),
          t.Literal("issue"),
          t.Literal("pr"),
        ]),
        ruleName: t.String(),
        ruleText: t.String(),
      }),
    },
  )
  .put(
    "/rules/:githubAccountId/:ruleId",
    async ({ params, body }) => {
      const { githubAccountId, ruleId } = params;

      const accountId = parseInt(githubAccountId, 10);
      const ruleIdNum = parseInt(ruleId, 10);

      if (isNaN(accountId)) {
        return { error: "Invalid GitHub account ID" };
      }

      if (isNaN(ruleIdNum)) {
        return { error: "Invalid rule ID" };
      }

      try {
        // Get the user's installations to verify ownership
        const userInstallations = await db
          .select({ installationId: installationSchema.installationId })
          .from(installationSchema)
          .where(
            and(
              eq(installationSchema.senderId, accountId),
              eq(installationSchema.isRemoved, false),
            ),
          );

        if (userInstallations.length === 0) {
          return { error: "No installation found" };
        }

        const installationIds = userInstallations.map(
          (inst) => inst.installationId,
        );

        // Verify the rule belongs to one of the user's installations
        const existingRule = await db
          .select()
          .from(rulesSchema)
          .where(
            and(
              eq(rulesSchema.id, ruleIdNum),
              inArray(rulesSchema.installationId, installationIds),
            ),
          )
          .limit(1);

        if (existingRule.length === 0) {
          return { error: "Rule not found" };
        }

        // Update the rule
        const [updatedRule] = await db
          .update(rulesSchema)
          .set({
            ...body,
            updatedAt: new Date(),
          })
          .where(eq(rulesSchema.id, ruleIdNum))
          .returning();

        return { rule: updatedRule };
      } catch (error) {
        console.error("Error updating rule:", error);
        return { error: "Failed to update rule" };
      }
    },
    {
      params: t.Object({
        githubAccountId: t.String(),
        ruleId: t.String(),
      }),
      body: t.Object({
        ruleType: t.Optional(
          t.Union([t.Literal("comment"), t.Literal("issue"), t.Literal("pr")]),
        ),
        ruleName: t.Optional(t.String()),
        ruleText: t.Optional(t.String()),
      }),
    },
  )
  .delete(
    "/rules/:githubAccountId/:ruleId",
    async ({ params }) => {
      const { githubAccountId, ruleId } = params;

      const accountId = parseInt(githubAccountId, 10);
      const ruleIdNum = parseInt(ruleId, 10);

      if (isNaN(accountId)) {
        return { error: "Invalid GitHub account ID" };
      }

      if (isNaN(ruleIdNum)) {
        return { error: "Invalid rule ID" };
      }

      try {
        // Get the user's installations to verify ownership
        const userInstallations = await db
          .select({ installationId: installationSchema.installationId })
          .from(installationSchema)
          .where(
            and(
              eq(installationSchema.senderId, accountId),
              eq(installationSchema.isRemoved, false),
            ),
          );

        if (userInstallations.length === 0) {
          return { error: "No installation found" };
        }

        const installationIds = userInstallations.map(
          (inst) => inst.installationId,
        );

        // Verify the rule belongs to one of the user's installations
        const existingRule = await db
          .select()
          .from(rulesSchema)
          .where(
            and(
              eq(rulesSchema.id, ruleIdNum),
              inArray(rulesSchema.installationId, installationIds),
            ),
          )
          .limit(1);

        if (existingRule.length === 0) {
          return { error: "Rule not found" };
        }

        // Delete the rule
        await db.delete(rulesSchema).where(eq(rulesSchema.id, ruleIdNum));

        return { success: true };
      } catch (error) {
        console.error("Error deleting rule:", error);
        return { error: "Failed to delete rule" };
      }
    },
    {
      params: t.Object({
        githubAccountId: t.String(),
        ruleId: t.String(),
      }),
    },
  )
  .get(
    "/dashboard/:githubAccountId",
    async ({ params }) => {
      const { githubAccountId } = params;

      const accountId = parseInt(githubAccountId, 10);

      if (isNaN(accountId)) {
        return { error: "Invalid GitHub account ID" };
      }

      try {
        // Get all installations for this user
        const userInstallations = await db
          .select({
            installationId: installationSchema.installationId,
            targetId: installationSchema.targetId,
          })
          .from(installationSchema)
          .where(
            and(
              eq(installationSchema.senderId, accountId),
              eq(installationSchema.isRemoved, false),
            ),
          );

        if (userInstallations.length === 0) {
          return {
            isInstalled: false,
            stats: {
              reposConnected: 0,
              reposChange: 0,
              issuesHandled: 0,
              issuesChange: 0,
              prsReviewed: 0,
              prsChange: 0,
              warningsIssued: 0,
              warningsChange: 0,
            },
            weeklyData: [],
            recentActivity: [],
          };
        }

        const installationIds = userInstallations.map(
          (inst) => inst.installationId,
        );
        const targetIds = userInstallations.map((inst) => inst.targetId);

        // Date calculations
        const now = new Date();
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const fourteenDaysAgo = new Date(
          now.getTime() - 14 * 24 * 60 * 60 * 1000,
        );

        // Get repos count (current)
        const reposResult = await db
          .select({ count: count() })
          .from(installationRepositoriesSchema)
          .where(
            and(
              inArray(installationRepositoriesSchema.targetId, targetIds),
              eq(installationRepositoriesSchema.isRemoved, false),
            ),
          );
        const reposConnected = reposResult[0]?.count ?? 0;

        // Get repos added in last 7 days
        const reposThisWeek = await db
          .select({ count: count() })
          .from(installationRepositoriesSchema)
          .where(
            and(
              inArray(installationRepositoriesSchema.targetId, targetIds),
              eq(installationRepositoriesSchema.isRemoved, false),
              gte(installationRepositoriesSchema.addedAt, sevenDaysAgo),
            ),
          );

        // Get repos added in previous 7 days (7-14 days ago)
        const reposLastWeek = await db
          .select({ count: count() })
          .from(installationRepositoriesSchema)
          .where(
            and(
              inArray(installationRepositoriesSchema.targetId, targetIds),
              eq(installationRepositoriesSchema.isRemoved, false),
              gte(installationRepositoriesSchema.addedAt, fourteenDaysAgo),
              lt(installationRepositoriesSchema.addedAt, sevenDaysAgo),
            ),
          );

        // Calculate % change for repos
        const reposThisWeekCount = reposThisWeek[0]?.count ?? 0;
        const reposLastWeekCount = reposLastWeek[0]?.count ?? 0;
        const reposChange =
          reposLastWeekCount === 0
            ? reposThisWeekCount > 0
              ? 100
              : 0
            : Math.round(
                ((reposThisWeekCount - reposLastWeekCount) /
                  reposLastWeekCount) *
                  100,
              );

        // Get issues handled (issue_analysis reports)
        const issuesTotal = await db
          .select({ count: count() })
          .from(reportSchema)
          .where(
            and(
              inArray(reportSchema.installationId, installationIds),
              eq(reportSchema.reportType, "issue_analysis"),
            ),
          );
        const issuesHandled = issuesTotal[0]?.count ?? 0;

        const issuesThisWeek = await db
          .select({ count: count() })
          .from(reportSchema)
          .where(
            and(
              inArray(reportSchema.installationId, installationIds),
              eq(reportSchema.reportType, "issue_analysis"),
              gte(reportSchema.createdAt, sevenDaysAgo),
            ),
          );

        const issuesLastWeek = await db
          .select({ count: count() })
          .from(reportSchema)
          .where(
            and(
              inArray(reportSchema.installationId, installationIds),
              eq(reportSchema.reportType, "issue_analysis"),
              gte(reportSchema.createdAt, fourteenDaysAgo),
              lt(reportSchema.createdAt, sevenDaysAgo),
            ),
          );

        const issuesThisWeekCount = issuesThisWeek[0]?.count ?? 0;
        const issuesLastWeekCount = issuesLastWeek[0]?.count ?? 0;
        const issuesChange =
          issuesLastWeekCount === 0
            ? issuesThisWeekCount > 0
              ? 100
              : 0
            : Math.round(
                ((issuesThisWeekCount - issuesLastWeekCount) /
                  issuesLastWeekCount) *
                  100,
              );

        // Get PRs reviewed (pr_analysis reports)
        const prsTotal = await db
          .select({ count: count() })
          .from(reportSchema)
          .where(
            and(
              inArray(reportSchema.installationId, installationIds),
              eq(reportSchema.reportType, "pr_analysis"),
            ),
          );
        const prsReviewed = prsTotal[0]?.count ?? 0;

        const prsThisWeek = await db
          .select({ count: count() })
          .from(reportSchema)
          .where(
            and(
              inArray(reportSchema.installationId, installationIds),
              eq(reportSchema.reportType, "pr_analysis"),
              gte(reportSchema.createdAt, sevenDaysAgo),
            ),
          );

        const prsLastWeek = await db
          .select({ count: count() })
          .from(reportSchema)
          .where(
            and(
              inArray(reportSchema.installationId, installationIds),
              eq(reportSchema.reportType, "pr_analysis"),
              gte(reportSchema.createdAt, fourteenDaysAgo),
              lt(reportSchema.createdAt, sevenDaysAgo),
            ),
          );

        const prsThisWeekCount = prsThisWeek[0]?.count ?? 0;
        const prsLastWeekCount = prsLastWeek[0]?.count ?? 0;
        const prsChange =
          prsLastWeekCount === 0
            ? prsThisWeekCount > 0
              ? 100
              : 0
            : Math.round(
                ((prsThisWeekCount - prsLastWeekCount) / prsLastWeekCount) *
                  100,
              );

        // Get warnings issued
        const warningsTotal = await db
          .select({ count: count() })
          .from(warningSchema)
          .where(inArray(warningSchema.installationId, installationIds));
        const warningsIssued = warningsTotal[0]?.count ?? 0;

        const warningsThisWeek = await db
          .select({ count: count() })
          .from(warningSchema)
          .where(
            and(
              inArray(warningSchema.installationId, installationIds),
              gte(warningSchema.createdAt, sevenDaysAgo),
            ),
          );

        const warningsLastWeek = await db
          .select({ count: count() })
          .from(warningSchema)
          .where(
            and(
              inArray(warningSchema.installationId, installationIds),
              gte(warningSchema.createdAt, fourteenDaysAgo),
              lt(warningSchema.createdAt, sevenDaysAgo),
            ),
          );

        const warningsThisWeekCount = warningsThisWeek[0]?.count ?? 0;
        const warningsLastWeekCount = warningsLastWeek[0]?.count ?? 0;
        const warningsChange =
          warningsLastWeekCount === 0
            ? warningsThisWeekCount > 0
              ? 100
              : 0
            : Math.round(
                ((warningsThisWeekCount - warningsLastWeekCount) /
                  warningsLastWeekCount) *
                  100,
              );

        // Get weekly data (rolling 7 days)
        const weeklyData: Array<{
          day: string;
          date: string;
          issues: number;
          prs: number;
        }> = [];

        const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

        for (let i = 6; i >= 0; i--) {
          const dayStart = new Date(now);
          dayStart.setDate(now.getDate() - i);
          dayStart.setHours(0, 0, 0, 0);

          const dayEnd = new Date(dayStart);
          dayEnd.setHours(23, 59, 59, 999);

          const dayIssues = await db
            .select({ count: count() })
            .from(reportSchema)
            .where(
              and(
                inArray(reportSchema.installationId, installationIds),
                eq(reportSchema.reportType, "issue_analysis"),
                gte(reportSchema.createdAt, dayStart),
                lt(reportSchema.createdAt, dayEnd),
              ),
            );

          const dayPrs = await db
            .select({ count: count() })
            .from(reportSchema)
            .where(
              and(
                inArray(reportSchema.installationId, installationIds),
                eq(reportSchema.reportType, "pr_analysis"),
                gte(reportSchema.createdAt, dayStart),
                lt(reportSchema.createdAt, dayEnd),
              ),
            );

          weeklyData.push({
            day: dayNames[dayStart.getDay()],
            date: dayStart.toISOString().split("T")[0],
            issues: dayIssues[0]?.count ?? 0,
            prs: dayPrs[0]?.count ?? 0,
          });
        }

        // Get recent activity (last 5 issue/pr analysis reports)
        const recentReports = await db
          .select()
          .from(reportSchema)
          .where(
            and(
              inArray(reportSchema.installationId, installationIds),
              inArray(reportSchema.reportType, [
                "issue_analysis",
                "pr_analysis",
              ]),
            ),
          )
          .orderBy(desc(reportSchema.createdAt))
          .limit(5);

        const recentActivity = recentReports.map((report) => {
          const createdAt = new Date(report.createdAt);
          const diffMs = now.getTime() - createdAt.getTime();
          const diffMins = Math.floor(diffMs / 60000);
          const diffHours = Math.floor(diffMs / 3600000);
          const diffDays = Math.floor(diffMs / 86400000);

          let timeAgo: string;
          if (diffMins < 1) {
            timeAgo = "Just now";
          } else if (diffMins < 60) {
            timeAgo = `${diffMins} min ago`;
          } else if (diffHours < 24) {
            timeAgo = `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
          } else {
            timeAgo = `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
          }

          const isIssue = report.reportType === "issue_analysis";

          return {
            id: report.id,
            type: isIssue ? ("issue" as const) : ("pr" as const),
            title: isIssue ? `Responded to issue` : `Reviewed PR`,
            repo: report.repositoryFullName,
            time: timeAgo,
            url: report.url,
          };
        });

        return {
          isInstalled: true,
          stats: {
            reposConnected,
            reposChange,
            issuesHandled,
            issuesChange,
            prsReviewed,
            prsChange,
            warningsIssued,
            warningsChange,
          },
          weeklyData,
          recentActivity,
        };
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        return { error: "Failed to fetch dashboard data" };
      }
    },
    {
      params: t.Object({
        githubAccountId: t.String(),
      }),
    },
  );
