import { test } from "node:test";
import assert from "node:assert/strict";
import { BuildStateManager } from "../src/state.ts";

test("initial state is idle", () => {
  const sm = new BuildStateManager();
  assert.equal(sm.getState(), "idle");
});

test("tryLock returns true when idle", () => {
  const sm = new BuildStateManager();
  assert.equal(sm.tryLock(), true);
});

test("tryLock returns false when already locked", () => {
  const sm = new BuildStateManager();
  sm.tryLock();
  assert.equal(sm.tryLock(), false);
});

test("unlock allows tryLock again", () => {
  const sm = new BuildStateManager();
  sm.tryLock();
  sm.unlock();
  assert.equal(sm.tryLock(), true);
});

test("setState updates state", () => {
  const sm = new BuildStateManager();
  sm.setState("building");
  assert.equal(sm.getState(), "building");
});
