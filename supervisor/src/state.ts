export type BuildState = "idle" | "building" | "success" | "failed";

export class BuildStateManager {
  private state: BuildState = "idle";
  private locked = false;

  getState(): BuildState {
    return this.state;
  }

  setState(s: BuildState): void {
    this.state = s;
  }

  tryLock(): boolean {
    if (this.locked) return false;
    this.locked = true;
    return true;
  }

  unlock(): void {
    this.locked = false;
  }
}

export const buildState = new BuildStateManager();
