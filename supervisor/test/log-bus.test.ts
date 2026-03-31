import { test } from "node:test";
import assert from "node:assert/strict";
import { LogBus } from "../src/log-bus.ts";

test("emit_log adds entry to buffer", () => {
  const bus = new LogBus();
  bus.emit_log("hello");
  const buf = bus.getBuffer();
  assert.equal(buf.length, 1);
  assert.equal(buf[0].line, "hello");
  assert.ok(buf[0].ts > 0);
});

test("getBuffer returns a copy", () => {
  const bus = new LogBus();
  bus.emit_log("a");
  const buf = bus.getBuffer();
  buf.push({ line: "mutated", ts: 0 });
  assert.equal(bus.getBuffer().length, 1);
});

test("buffer caps at 500 entries", () => {
  const bus = new LogBus();
  for (let i = 0; i < 510; i++) bus.emit_log(`line ${i}`);
  assert.equal(bus.getBuffer().length, 500);
  assert.equal(bus.getBuffer()[0].line, "line 10");
});

test("clear empties buffer", () => {
  const bus = new LogBus();
  bus.emit_log("x");
  bus.clear();
  assert.equal(bus.getBuffer().length, 0);
});

test("emit_log fires log event with entry", (t, done) => {
  const bus = new LogBus();
  bus.on("log", (entry) => {
    assert.equal(entry.line, "fired");
    done();
  });
  bus.emit_log("fired");
});
