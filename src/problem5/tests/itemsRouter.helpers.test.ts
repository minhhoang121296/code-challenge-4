import assert from "node:assert/strict";
import test from "node:test";
import { isUuid, paramId, parseLimitOffset } from "../src/routes/itemsRouter.js";

test("parseLimitOffset uses defaults when query is empty", () => {
  const parsed = parseLimitOffset({});
  assert.deepEqual(parsed, { limit: 50, offset: 0 });
});

test("parseLimitOffset clamps limit and sanitizes offset", () => {
  assert.deepEqual(parseLimitOffset({ limit: "999", offset: "-5" }), {
    limit: 100,
    offset: 0,
  });
  assert.deepEqual(parseLimitOffset({ limit: "0", offset: "20" }), {
    limit: 1,
    offset: 20,
  });
});

test("paramId extracts id from params", () => {
  assert.equal(paramId({ id: "abc" }), "abc");
  assert.equal(paramId({ id: ["first", "second"] }), "first");
  assert.equal(paramId({}), undefined);
});

test("isUuid validates UUID format", () => {
  assert.equal(isUuid("d2719af2-c7ea-4eb3-a37e-88f86631d530"), true);
  assert.equal(isUuid("not-a-uuid"), false);
});
