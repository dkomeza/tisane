import { tmpdir } from "node:os";
import { join } from "node:path";
import { logBus } from "./log-bus.js";
import { buildState } from "./state.js";
import {
  REPO_URL,
  IMAGE_NAME,
  CONTAINER_NAME,
  HEALTHCHECK_URL,
  HEALTH_POLL_INTERVAL_MS,
  HEALTH_POLL_MAX_ATTEMPTS,
} from "./constants.js";
import { cloneRepo, npmInstall, runInstallPlugins } from "./git.js";
import {
  inspectContainer,
  buildImage,
  stopContainer,
  renameContainer,
  startContainer,
  removeContainer,
  removeImage,
  pollHealthcheck,
  type ContainerSnapshot,
} from "./docker.js";

const PREV_CONTAINER_NAME = `${CONTAINER_NAME}_prev`;

export async function runPipeline(): Promise<void> {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error("DATABASE_URL is not set");

  const timestamp = Date.now();
  const buildDir = join(tmpdir(), `tisane-build-${timestamp}`);
  const imageTag = `${IMAGE_NAME}:${timestamp}`;

  let snapshot: ContainerSnapshot | null = null;
  let swapped = false; // true after old container is renamed to _prev

  try {
    buildState.setState("building");
    logBus.emit_state("building");

    // Stage 1: snapshot old container
    logBus.emit_log("[pipeline] Snapshotting current container...");
    snapshot = await inspectContainer(CONTAINER_NAME);
    logBus.emit_log(`[pipeline] Snapshot: image=${snapshot.imageId.slice(0, 12)}`);

    // Stage 2: clone repo
    await cloneRepo(REPO_URL, buildDir);

    // Stage 3: npm ci
    await npmInstall(buildDir);

    // Stage 4: install-plugins.ts
    await runInstallPlugins(buildDir, databaseUrl);

    // Stage 5: docker build
    await buildImage(buildDir, imageTag);

    // Stage 6: stop old, rename for rollback
    await stopContainer(CONTAINER_NAME);
    await renameContainer(CONTAINER_NAME, PREV_CONTAINER_NAME);
    swapped = true;

    // Stage 7: start new container
    await startContainer(snapshot, imageTag);

    // Stage 8: health poll
    const healthy = await pollHealthcheck(
      HEALTHCHECK_URL,
      HEALTH_POLL_MAX_ATTEMPTS,
      HEALTH_POLL_INTERVAL_MS,
    );

    if (!healthy) {
      throw new Error("New container failed healthcheck — rolling back");
    }

    // Stage 9: cleanup old
    logBus.emit_log("[pipeline] Removing old container and image...");
    await removeContainer(PREV_CONTAINER_NAME);
    await removeImage(snapshot.imageId);

    buildState.setState("success");
    logBus.emit_log("[pipeline] Deploy complete!");
    logBus.emit_state("success");
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    logBus.emit_log(`[pipeline] ERROR: ${message}`);

    // Rollback: only attempt if the swap already happened (stages 6+)
    if (swapped && snapshot) {
      try {
        logBus.emit_log("[pipeline] Rolling back to previous container...");
        await removeContainer(CONTAINER_NAME).catch(() => {});
        await renameContainer(PREV_CONTAINER_NAME, CONTAINER_NAME);
        await spawnStart(CONTAINER_NAME);
        logBus.emit_log("[pipeline] Rollback complete");
      } catch (rollbackErr) {
        logBus.emit_log(
          `[pipeline] Rollback failed: ${rollbackErr instanceof Error ? rollbackErr.message : rollbackErr}`,
        );
      }
    }

    buildState.setState("failed");
    logBus.emit_state("failed");
    throw err;
  } finally {
    buildState.unlock();
  }
}

// Start a stopped container by name
async function spawnStart(name: string): Promise<void> {
  const { spawn } = await import("node:child_process");
  return new Promise((resolve, reject) => {
    const proc = spawn("docker", ["start", name], {
      stdio: ["ignore", "pipe", "pipe"],
    });
    proc.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`docker start exited with code ${code}`));
    });
  });
}
