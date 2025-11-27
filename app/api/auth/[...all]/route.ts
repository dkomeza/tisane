import { auth } from "@/lib/auth/server"; // import from your src/auth.ts
import { toNextJsHandler } from "better-auth/next-js";

export const { POST, GET } = toNextJsHandler(auth.handler);
