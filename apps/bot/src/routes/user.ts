import { Elysia, t } from "elysia";

interface User {
  id: number;
  name: string;
  email: string;
}

let users: User[] = [];
let nextId = 1;

export const userRouter = new Elysia({ prefix: "/users" })
  .get("/", () => users)
  .get(
    "/:id",
    ({ params }) => {
      const user = users.find((u) => u.id === +params.id);
      if (!user) throw new Error("User not found");
      return user;
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
      const newUser = { ...body, id: nextId++ };
      users.push(newUser);
      return newUser;
    },
    {
      body: t.Object({
        name: t.String(),
        email: t.String(),
      }),
    },
  )
  .put(
    "/:id",
    ({ params, body }) => {
      const index = users.findIndex((u) => u.id === +params.id);
      if (index === -1) throw new Error("User not found");
      users[index] = { ...users[index], ...body };
      return users[index];
    },
    {
      params: t.Object({
        id: t.String(),
      }),
      body: t.Partial(
        t.Object({
          name: t.String(),
          email: t.String(),
        }),
      ),
    },
  )
  .delete(
    "/:id",
    ({ params }) => {
      const index = users.findIndex((u) => u.id === +params.id);
      if (index === -1) throw new Error("User not found");
      users.splice(index, 1);
      return { message: "User deleted" };
    },
    {
      params: t.Object({
        id: t.String(),
      }),
    },
  );
