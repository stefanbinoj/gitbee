import { Elysia } from "elysia";
import { userRouter } from "./routes/user";
import { todoRouter } from "./routes/todo";
import { webhookRouter } from "./routes/webhook";
import "./botActions";
import {vectorDb} from "@gitbee/vector-db"

const apiRouter = new Elysia({ prefix: "/api" })
  .use(userRouter)
  .use(todoRouter)
  .use(webhookRouter);

const app = new Elysia().use(apiRouter).listen(4000);

console.log("Vector DB connected:", vectorDb !== null);
console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
