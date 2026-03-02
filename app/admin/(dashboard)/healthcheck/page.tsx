"use client";

import { useCallback, useEffect, useState } from "react";
import { RefreshCw, Database, HardDrive, Cpu } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { HealthCheckResponse } from "@/app/api/admin/healthcheck/route";

type Status = "healthy" | "degraded" | "error" | "loading";

function StatusBadge({ status }: { status: Status }) {
  const styles: Record<Status, string> = {
    healthy: "bg-emerald-500/15 text-emerald-600 border-emerald-500/30",
    degraded: "bg-amber-500/15 text-amber-600 border-amber-500/30",
    error: "bg-red-500/15 text-red-600 border-red-500/30",
    loading: "bg-muted/60 text-muted-foreground border-border",
  };
  const labels: Record<Status, string> = {
    healthy: "Healthy",
    degraded: "Degraded",
    error: "Error",
    loading: "Checking…",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status]}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          status === "loading"
            ? "bg-muted-foreground animate-pulse"
            : status === "healthy"
              ? "bg-emerald-500 animate-pulse"
              : status === "degraded"
                ? "bg-amber-500"
                : "bg-red-500"
        }`}
      />
      {labels[status]}
    </span>
  );
}

interface ServiceCardProps {
  icon: React.ReactNode;
  name: string;
  subtitle: string;
  status: Status;
  latencyMs?: number;
  detail?: string;
}

function ServiceCard({
  icon,
  name,
  subtitle,
  status,
  latencyMs,
  detail,
}: ServiceCardProps) {
  return (
    <div className="flex flex-col gap-3 p-5 rounded-xl border border-border bg-card shadow-sm transition-all">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-muted text-muted-foreground">
            {icon}
          </div>
          <div>
            <p className="font-semibold text-sm leading-tight">{name}</p>
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          </div>
        </div>
        <StatusBadge status={status} />
      </div>

      {(latencyMs !== undefined || detail) && (
        <div className="flex flex-col gap-1 pt-2 border-t border-border/60">
          {latencyMs !== undefined && (
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Latency</span>
              <span className="font-mono font-medium">
                {latencyMs}
                <span className="text-muted-foreground ml-0.5">ms</span>
              </span>
            </div>
          )}
          {detail && (
            <p className="text-xs text-muted-foreground italic truncate">
              {detail}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function formatUptime(seconds: number): string {
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (d > 0) return `${d}d ${h}h ${m}m`;
  if (h > 0) return `${h}h ${m}m ${s}s`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

export default function HealthcheckPage() {
  const [data, setData] = useState<HealthCheckResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchHealth = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/healthcheck");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json: HealthCheckResponse = await res.json();
      setData(json);
      setLastChecked(new Date());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to fetch health data");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHealth();
    const interval = setInterval(fetchHealth, 30_000);
    return () => clearInterval(interval);
  }, [fetchHealth]);

  const dbStatus: Status = isLoading
    ? "loading"
    : (data?.services.database.status ?? "loading");
  const storageStatus: Status = isLoading
    ? "loading"
    : (data?.services.storage.status ?? "loading");

  const allHealthy =
    data &&
    data.services.database.status === "healthy" &&
    data.services.storage.status === "healthy";

  return (
    <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Healthcheck</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {lastChecked
              ? `Last checked at ${lastChecked.toLocaleTimeString()} · auto-refreshes every 30s`
              : "Checking system status…"}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchHealth}
          disabled={isLoading}
          className="gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Overall status banner */}
      {data && (
        <div
          className={`flex items-center gap-3 px-5 py-4 rounded-xl border ${
            allHealthy
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-400"
              : "bg-red-500/10 border-red-500/30 text-red-700 dark:text-red-400"
          }`}
        >
          <span
            className={`w-2.5 h-2.5 rounded-full shrink-0 ${allHealthy ? "bg-emerald-500 animate-pulse" : "bg-red-500"}`}
          />
          <span className="font-medium text-sm">
            {allHealthy
              ? "All systems operational"
              : "One or more services are experiencing issues"}
          </span>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="flex items-center gap-3 px-5 py-4 rounded-xl border bg-red-500/10 border-red-500/30 text-red-700 dark:text-red-400">
          <span className="font-medium text-sm">Error: {error}</span>
        </div>
      )}

      {/* Service cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <ServiceCard
          icon={<Database className="w-4 h-4" />}
          name="Database"
          subtitle="PostgreSQL via Prisma"
          status={dbStatus}
          latencyMs={!isLoading ? data?.services.database.latencyMs : undefined}
          detail={!isLoading ? data?.services.database.detail : undefined}
        />
        <ServiceCard
          icon={<HardDrive className="w-4 h-4" />}
          name="Storage"
          subtitle="Minio / S3"
          status={storageStatus}
          latencyMs={!isLoading ? data?.services.storage.latencyMs : undefined}
          detail={!isLoading ? data?.services.storage.detail : undefined}
        />
        <ServiceCard
          icon={<Cpu className="w-4 h-4" />}
          name="Application"
          subtitle={data?.version ? `${data.version}` : "Unversioned / Dev"}
          status={isLoading ? "loading" : data ? "healthy" : "loading"}
          latencyMs={undefined}
          detail={
            !isLoading && data
              ? `Uptime: ${formatUptime(data.uptimeSeconds)}`
              : undefined
          }
        />
      </div>
    </div>
  );
}
