import { authorize } from "@/lib/auth/authorize";
import { NextResponse } from "next/server";

export async function POST() {
  const { authorized } = await authorize();

  if (!authorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const watchtowerUrl = "http://watchtower:8080/v1/update";
  const token = process.env.WATCHTOWER_HTTP_API_TOKEN;

  if (!token) {
    return NextResponse.json(
      { error: "Watchtower token not configured" },
      { status: 500 },
    );
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 1000);

  try {
    const response = await fetch(watchtowerUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      throw new Error(`Watchtower responded with status: ${response.status}`);
    }

    return NextResponse.json({
      success: true,
      message: "Update started",
    });
  } catch (error) {
    clearTimeout(timeout);

    if (error instanceof Error && error.name === "AbortError") {
      return NextResponse.json({
        success: true,
        message: "Update started",
      });
    }

    console.error("Failed to trigger update:", error);
    return NextResponse.json(
      { error: "Failed to trigger update" },
      { status: 500 },
    );
  }
}
