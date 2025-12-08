import { Elysia, t } from "elysia";

interface Todo {
  id: number;
  title: string;
  completed: boolean;
  userId: number;
}

let todos: Todo[] = [];
let nextId = 1;

export const todoRouter = new Elysia({ prefix: "/todos" })
  .get("/", () => todos)
  .get(
    "/:id",
    ({ params }) => {
      const todo = todos.find((t) => t.id === +params.id);
      if (!todo) throw new Error("Todo not found");
      return todo;
    },
    {
      params: t.Object({
        id: t.String(),
      }),
    },
  )
  .post(
    "/",
    ({ body }) => {
      const newTodo = { ...body, id: nextId++ };
      todos.push(newTodo);
      return newTodo;
    },
    {
      body: t.Object({
        title: t.String(),
        completed: t.Boolean(),
        userId: t.Number(),
      }),
    },
  )
  .put(
    "/:id",
    ({ params, body }) => {
      const index = todos.findIndex((t) => t.id === +params.id);
      if (index === -1) throw new Error("Todo not found");
      todos[index] = { ...todos[index], ...body };
      return todos[index];
    },
    {
      params: t.Object({
        id: t.String(),
      }),
      body: t.Partial(
        t.Object({
          title: t.String(),
          completed: t.Boolean(),
          userId: t.Number(),
        }),
      ),
    },
  )
  .delete(
    "/:id",
    ({ params }) => {
      const index = todos.findIndex((t) => t.id === +params.id);
      if (index === -1) throw new Error("Todo not found");
      todos.splice(index, 1);
      return { message: "Todo deleted" };
    },
    {
      params: t.Object({
        id: t.String(),
      }),
    },
  );
