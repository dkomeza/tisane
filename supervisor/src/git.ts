import { spawn } from "node:child_process";
import { logBus } from "./log-bus.js";

function spawnStreaming(
  cmd: string,
  args: string[],
  cwd?: string,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const proc = spawn(cmd, args, {
      cwd,
      stdio: ["ignore", "pipe", "pipe"],
    });

    const onData = (prefix: string) => (data: Buffer) => {
      for (const line of data.toString().split("\n")) {
        if (line.trim()) logBus.emit_log(`[${prefix}] ${line}`);
      }
    };

    proc.stdout.on("data", onData(cmd));
    proc.stderr.on("data", onData(cmd));

    proc.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${cmd} exited with code ${code}`));
    });
  });
}

export async function cloneRepo(repoUrl: string, destDir: string): Promise<void> {
  logBus.emit_log(`[git] Cloning ${repoUrl} into ${destDir}`);
  await spawnStreaming("git", ["clone", "--depth=1", repoUrl, destDir]);
  logBus.emit_log("[git] Clone complete");
}

export async function npmInstall(cwd: string): Promise<void> {
  logBus.emit_log("[npm] Running npm ci...");
  await spawnStreaming("npm", ["ci"], cwd);
  logBus.emit_log("[npm] npm ci complete");
}

export async function runInstallPlugins(
  cwd: string,
  databaseUrl: string,
): Promise<void> {
  logBus.emit_log("[plugins] Running install-plugins.ts...");
  return new Promise((resolve, reject) => {
    const proc = spawn(
      "node_modules/.bin/tsx",
      ["scripts/install-plugins.ts"],
      {
        cwd,
        stdio: ["ignore", "pipe", "pipe"],
        env: { ...process.env, DATABASE_URL: databaseUrl },
      },
    );

    const onData = (data: Buffer) => {
      for (const line of data.toString().split("\n")) {
        if (line.trim()) logBus.emit_log(`[plugins] ${line}`);
      }
    };

    proc.stdout.on("data", onData);
    proc.stderr.on("data", onData);

    proc.on("close", (code) => {
      if (code === 0) {
        logBus.emit_log("[plugins] install-plugins.ts complete");
        resolve();
      } else {
        reject(new Error(`install-plugins.ts exited with code ${code}`));
      }
    });
  });
}
