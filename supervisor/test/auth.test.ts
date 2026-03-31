import { test } from "node:test";
import assert from "node:assert/strict";
import { checkToken } from "../src/auth.ts";

test("returns true for matching token", () => {
  assert.equal(checkToken("secret", "secret"), true);
});

test("returns false for wrong token", () => {
  assert.equal(checkToken("secret", "wrong"), false);
});

test("returns false for empty provided token", () => {
  assert.equal(checkToken("secret", ""), false);
});

test("returns false when expected token is empty", () => {
  assert.equal(checkToken("", "anything"), false);
});
