import { authorize } from "@/lib/auth/authorize";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { s3Client } from "@/lib/storage";
import { HeadBucketCommand } from "@aws-sdk/client-s3";

export interface HealthCheckResult {
  status: "healthy" | "degraded" | "error";
  latencyMs: number;
  detail?: string;
}

export interface HealthCheckResponse {
  timestamp: string;
  version: string | null;
  uptimeSeconds: number;
  services: {
    database: HealthCheckResult;
    storage: HealthCheckResult;
  };
}

async function checkDatabase(): Promise<HealthCheckResult> {
  const start = Date.now();
  try {
    await prisma.$queryRaw`SELECT 1`;
    return { status: "healthy", latencyMs: Date.now() - start };
  } catch (error) {
    return {
      status: "error",
      latencyMs: Date.now() - start,
      detail: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

async function checkStorage(): Promise<HealthCheckResult> {
  const start = Date.now();
  try {
    const bucket = process.env.S3_BUCKET;
    if (!bucket) {
      return {
        status: "degraded",
        latencyMs: Date.now() - start,
        detail: "S3_BUCKET env var not set",
      };
    }
    await s3Client.send(new HeadBucketCommand({ Bucket: bucket }));
    return { status: "healthy", latencyMs: Date.now() - start };
  } catch (error) {
    return {
      status: "error",
      latencyMs: Date.now() - start,
      detail: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function GET() {
  const { authorized } = await authorize();

  // Allow unauthenticated callers (e.g. Docker healthcheck probe) to get a
  // simple liveness response without exposing any internal service details.
  if (!authorized) {
    return NextResponse.json({ ok: true });
  }

  const [database, storage] = await Promise.all([
    checkDatabase(),
    checkStorage(),
  ]);

  const body: HealthCheckResponse = {
    timestamp: new Date().toISOString(),
    version: process.env.NEXT_PUBLIC_APP_VERSION ?? null,
    uptimeSeconds: Math.floor(process.uptime()),
    services: { database, storage },
  };

  return NextResponse.json(body);
}
