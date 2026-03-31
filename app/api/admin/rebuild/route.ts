import { authorize } from "@/lib/auth/authorize";
import { NextResponse } from "next/server";

export async function POST() {
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

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 3000);

  try {
    const response = await fetch("http://supervisor:3001/v1/rebuild", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (response.status === 409) {
      return NextResponse.json(
        { error: "Build already in progress" },
        { status: 409 },
      );
    }

    if (!response.ok) {
      throw new Error(`Supervisor responded with ${response.status}`);
    }

    return NextResponse.json({ ok: true, message: "Build started" });
  } catch (error) {
    clearTimeout(timeout);
    if (error instanceof Error && error.name === "AbortError") {
      return NextResponse.json({ ok: true, message: "Build started" });
    }
    console.error("Failed to trigger rebuild:", error);
    return NextResponse.json(
      { error: "Failed to trigger rebuild" },
      { status: 500 },
    );
  }
}
