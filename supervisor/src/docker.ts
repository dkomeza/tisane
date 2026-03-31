import { spawn } from "node:child_process";
import { logBus } from "./log-bus.js";
import { CONTAINER_NAME } from "./constants.js";

export interface ContainerSnapshot {
  id: string;
  imageId: string;
  env: string[];
  networkName: string;
  networkAliases: string[];
  restartPolicy: string;
  mounts: Array<{ type: string; source: string; destination: string }>;
}

function spawnStreaming(
  cmd: string,
  args: string[],
  label: string,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const proc = spawn(cmd, args, { stdio: ["ignore", "pipe", "pipe"] });
    const onData = (data: Buffer) => {
      for (const line of data.toString().split("\n")) {
        if (line.trim()) logBus.emit_log(`[${label}] ${line}`);
      }
    };
    proc.stdout.on("data", onData);
    proc.stderr.on("data", onData);
    proc.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${label} exited with code ${code}`));
    });
  });
}

function spawnCapture(cmd: string, args: string[]): Promise<string> {
  return new Promise((resolve, reject) => {
    const proc = spawn(cmd, args, { stdio: ["ignore", "pipe", "pipe"] });
    let out = "";
    proc.stdout.on("data", (d: Buffer) => (out += d.toString()));
    proc.on("close", (code) => {
      if (code === 0) resolve(out.trim());
      else reject(new Error(`${cmd} exited with code ${code}`));
    });
  });
}

export async function inspectContainer(name: string): Promise<ContainerSnapshot> {
  const raw = await spawnCapture("docker", [
    "inspect",
    "--format",
    "{{json .}}",
    name,
  ]);
  const info = JSON.parse(raw);

  const networks = info.NetworkSettings?.Networks ?? {};
  const networkName = Object.keys(networks)[0] ?? "tisane_net";
  const networkAliases: string[] = networks[networkName]?.Aliases ?? [];

  return {
    id: info.Id as string,
    imageId: info.Image as string,
    env: (info.Config?.Env ?? []) as string[],
    networkName,
    networkAliases,
    restartPolicy: info.HostConfig?.RestartPolicy?.Name ?? "unless-stopped",
    mounts: ((info.Mounts ?? []) as Array<{
      Type: string;
      Source: string;
      Destination: string;
    }>).map((m) => ({
      type: m.Type,
      source: m.Source,
      destination: m.Destination,
    })),
  };
}

export async function buildImage(
  buildDir: string,
  tag: string,
): Promise<void> {
  logBus.emit_log(`[docker] Building image ${tag}...`);
  await spawnStreaming(
    "docker",
    ["build", "-t", tag, buildDir],
    "docker build",
  );
  logBus.emit_log(`[docker] Image ${tag} built`);
}

export async function stopContainer(name: string): Promise<void> {
  logBus.emit_log(`[docker] Stopping ${name}...`);
  await spawnStreaming("docker", ["stop", name], "docker stop");
}

export async function renameContainer(
  oldName: string,
  newName: string,
): Promise<void> {
  await spawnStreaming(
    "docker",
    ["rename", oldName, newName],
    "docker rename",
  );
}

export async function removeContainer(name: string): Promise<void> {
  await spawnStreaming("docker", ["rm", name], "docker rm");
}

export async function removeImage(imageId: string): Promise<void> {
  await spawnStreaming("docker", ["rmi", imageId], "docker rmi").catch(() => {
    // ignore — image may be in use or already gone
  });
}

export async function startContainer(
  snapshot: ContainerSnapshot,
  image: string,
): Promise<void> {
  logBus.emit_log(`[docker] Starting new container ${CONTAINER_NAME}...`);

  const args = [
    "run",
    "-d",
    "--name",
    CONTAINER_NAME,
    "--network",
    snapshot.networkName,
    "--restart",
    snapshot.restartPolicy,
  ];

  for (const alias of snapshot.networkAliases) {
    args.push("--network-alias", alias);
  }

  for (const env of snapshot.env) {
    args.push("-e", env);
  }

  for (const mount of snapshot.mounts) {
    if (mount.type === "bind") {
      args.push("-v", `${mount.source}:${mount.destination}`);
    } else if (mount.type === "volume") {
      args.push("-v", `${mount.source}:${mount.destination}`);
    }
  }

  args.push(image);

  await spawnStreaming("docker", args, "docker run");
  logBus.emit_log(`[docker] Container ${CONTAINER_NAME} started`);
}

export async function pollHealthcheck(url: string, attempts: number, intervalMs: number): Promise<boolean> {
  for (let i = 0; i < attempts; i++) {
    logBus.emit_log(`[health] Polling ${url} (attempt ${i + 1}/${attempts})...`);
    try {
      const res = await fetch(url);
      if (res.ok) {
        logBus.emit_log("[health] Healthcheck passed");
        return true;
      }
    } catch {
      // not ready yet
    }
    await new Promise((r) => setTimeout(r, intervalMs));
  }
  return false;
}
