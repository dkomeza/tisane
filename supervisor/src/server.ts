import { createServer, IncomingMessage, ServerResponse } from "node:http";
import { logBus } from "./log-bus.js";
import { buildState } from "./state.js";
import { authorize } from "./auth.js";
import { initSSE, sendEvent } from "./sse.js";
import { runPipeline } from "./pipeline.js";
import { SUPERVISOR_PORT } from "./constants.js";

function handleHealth(_req: IncomingMessage, res: ServerResponse): void {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ ok: true }));
}

function handleStatus(_req: IncomingMessage, res: ServerResponse): void {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ state: buildState.getState() }));
}

function handleRebuildStream(
  _req: IncomingMessage,
  res: ServerResponse,
): void {
  initSSE(res);

  // Replay buffer to late-connecting clients
  for (const entry of logBus.getBuffer()) {
    sendEvent(res, "log", entry);
  }

  // Send current state
  sendEvent(res, "state", { state: buildState.getState() });

  const onLog = (entry: unknown) => sendEvent(res, "log", entry);
  const onState = (payload: unknown) => {
    sendEvent(res, "state", payload);
    const s = (payload as { state: string }).state;
    if (s === "success" || s === "failed") {
      logBus.off("log", onLog);
      logBus.off("state", onState);
      res.end();
    }
  };

  logBus.on("log", onLog);
  logBus.on("state", onState);

  _req.on("close", () => {
    logBus.off("log", onLog);
    logBus.off("state", onState);
  });
}

async function handleRebuildTrigger(
  _req: IncomingMessage,
  res: ServerResponse,
): Promise<void> {
  if (!buildState.tryLock()) {
    res.writeHead(409, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Build already in progress" }));
    return;
  }

  logBus.clear();
  res.writeHead(202, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ ok: true, message: "Build started" }));

  // Run pipeline async — do not await
  runPipeline().catch((err) => {
    console.error("Pipeline error:", err);
  });
}

const server = createServer(
  (req: IncomingMessage, res: ServerResponse): void => {
    const url = req.url ?? "";
    const method = req.method ?? "";

    if (url === "/v1/health" && method === "GET") {
      handleHealth(req, res);
      return;
    }

    if (!authorize(req, res)) return;

    if (url === "/v1/status" && method === "GET") {
      handleStatus(req, res);
      return;
    }

    if (url === "/v1/rebuild" && method === "POST") {
      handleRebuildTrigger(req, res).catch((err) => {
        console.error(err);
        if (!res.headersSent) {
          res.writeHead(500);
          res.end();
        }
      });
      return;
    }

    if (url === "/v1/rebuild/stream" && method === "GET") {
      handleRebuildStream(req, res);
      return;
    }

    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Not found" }));
  },
);

server.listen(SUPERVISOR_PORT, () => {
  console.log(`Supervisor listening on :${SUPERVISOR_PORT}`);
});
