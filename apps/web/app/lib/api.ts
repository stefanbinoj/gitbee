import { treaty } from "@elysiajs/eden";
import type { app } from "@gitbee/bot";

export const api = treaty<app>("http://localhost:4000");
