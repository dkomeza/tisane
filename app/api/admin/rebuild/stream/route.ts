import { authorize } from "@/lib/auth/authorize";
import { NextResponse } from "next/server";

export async function GET() {
  const { authorized } = await authorize();

  if (!authorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = process.env.SUPERVISOR_TOKEN;
  if (!token) {
    return NextResponse.json(
      { error: "SUPERVISOR_TOKEN not configured" },
      { status: 500 },
    );
  }

  const upstream = await fetch("http://supervisor:3001/v1/rebuild/stream", {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!upstream.ok || !upstream.body) {
    return NextResponse.json(
      { error: "Failed to connect to supervisor stream" },
      { status: 502 },
    );
  }

  return new Response(upstream.body, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
