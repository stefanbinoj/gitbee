import { Elysia } from "elysia";
import { userRouter } from "./routes/user";
import { todoRouter } from "./routes/todo";
import { webhookRouter } from "./routes/webhook";
import { cors } from "@elysiajs/cors";
import "./botActions";

const apiRouter = new Elysia({ prefix: "/api" })
  .use(cors({ origin: "*" }))
  .use(userRouter)
  .use(todoRouter)
  .use(webhookRouter);

const app = new Elysia().use(apiRouter).listen(4000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);

export type app = typeof app;
