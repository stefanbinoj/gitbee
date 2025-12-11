"use client";

import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL,
});

// Type for the session with GitHub account ID
export type Session = typeof authClient.$Infer.Session & {
  session: {
    githubAccountId: number | null;
  };
};
