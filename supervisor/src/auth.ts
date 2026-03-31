import { IncomingMessage, ServerResponse } from "node:http";
import { timingSafeEqual } from "node:crypto";

export function checkToken(expected: string, provided: string): boolean {
  if (!expected || !provided) return false;
  if (expected.length !== provided.length) return false;
  return timingSafeEqual(Buffer.from(expected), Buffer.from(provided));
}

export function authorize(req: IncomingMessage, res: ServerResponse): boolean {
  const token = process.env.SUPERVISOR_TOKEN ?? "";
  if (!token) {
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "SUPERVISOR_TOKEN not configured" }));
    return false;
  }

  const header = req.headers["authorization"] ?? "";
  const provided = header.startsWith("Bearer ") ? header.slice(7) : "";

  if (!checkToken(token, provided)) {
    res.writeHead(401, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Unauthorized" }));
    return false;
  }

  return true;
}
