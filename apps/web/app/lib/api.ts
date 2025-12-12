import { treaty } from "@elysiajs/eden";
import type { app } from "@gitbee/bot";

export const api = treaty<app>(process.env.NEXT_PUBLIC_API_URL!);
