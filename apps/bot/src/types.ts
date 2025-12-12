import { Elysia } from "elysia";
import { userRouter } from "./routes/user";
import { webhookRouter } from "./routes/webhook";
import { cors } from "@elysiajs/cors";

const apiRouter = new Elysia({ prefix: "/api" })
  .use(cors({ origin: "*" }))
  .use(webhookRouter)
  .use(userRouter);

const app = new Elysia().use(apiRouter);

export type app = typeof app;
