"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

type BuildState = "idle" | "building" | "success" | "failed";

export function RebuildButton() {
  const [state, setState] = useState<BuildState>("idle");
  const [logs, setLogs] = useState<string[]>([]);
  const logEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  async function handleRebuild() {
    if (state === "building") return;

    setState("building");
    setLogs([]);

    const triggerRes = await fetch("/api/admin/rebuild", { method: "POST" });
    if (!triggerRes.ok) {
      if (triggerRes.status === 409) {
        setLogs(["Build already in progress — connect to stream..."]);
      } else {
        setState("failed");
        setLogs(["Failed to start rebuild. Check server logs."]);
        return;
      }
    }

    const es = new EventSource("/api/admin/rebuild/stream");

    es.addEventListener("log", (e) => {
      const { line } = JSON.parse(e.data) as { line: string };
      setLogs((prev) => [...prev, line]);
    });

    es.addEventListener("state", (e) => {
      const { state: newState } = JSON.parse(e.data) as { state: BuildState };
      setState(newState);
      if (newState === "success") {
        es.close();
        setTimeout(() => router.refresh(), 1000);
      } else if (newState === "failed") {
        es.close();
      }
    });

    es.onerror = () => {
      es.close();
      setState((prev) => (prev === "building" ? "failed" : prev));
    };
  }

  return (
    <div>
      <button
        onClick={handleRebuild}
        disabled={state === "building"}
        className="inline-flex items-center gap-2 rounded-md bg-yellow-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-yellow-700 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {state === "building" ? "Rebuilding..." : "Rebuild Now"}
      </button>

      {state === "success" && (
        <span className="ml-3 text-sm text-green-600 dark:text-green-400">
          Rebuild succeeded — refreshing...
        </span>
      )}

      {state === "failed" && (
        <span className="ml-3 text-sm text-destructive">
          Rebuild failed — see logs below (rollback attempted).
        </span>
      )}

      {logs.length > 0 && (
        <div className="mt-3 max-h-64 overflow-y-auto rounded-md bg-black/90 p-3 font-mono text-xs text-green-400">
          {logs.map((line, i) => (
            <div key={i}>{line}</div>
          ))}
          <div ref={logEndRef} />
        </div>
      )}
    </div>
  );
}
