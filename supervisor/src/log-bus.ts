import { EventEmitter } from "node:events";

export interface LogEntry {
  line: string;
  ts: number;
}

const BUFFER_MAX = 500;

export class LogBus extends EventEmitter {
  private buffer: LogEntry[] = [];

  emit_log(line: string): void {
    const entry: LogEntry = { line, ts: Date.now() };
    this.buffer.push(entry);
    if (this.buffer.length > BUFFER_MAX) this.buffer.shift();
    this.emit("log", entry);
  }

  emit_state(state: string): void {
    this.emit("state", { state });
  }

  getBuffer(): LogEntry[] {
    return [...this.buffer];
  }

  clear(): void {
    this.buffer = [];
  }
}

export const logBus = new LogBus();
