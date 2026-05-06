import assert from "node:assert/strict";
import test from "node:test";
import { createItemSchema, updateItemSchema } from "../src/validation/itemSchemas.js";

test("createItemSchema accepts valid payload and trims title", () => {
  const parsed = createItemSchema.parse({
    title: "  build feature  ",
    description: "details",
    status: "active",
  });

  assert.equal(parsed.title, "build feature");
  assert.equal(parsed.description, "details");
  assert.equal(parsed.status, "active");
});

test("createItemSchema rejects empty title", () => {
  const result = createItemSchema.safeParse({
    title: "   ",
  });

  assert.equal(result.success, false);
  if (!result.success) {
    assert.equal(result.error.issues[0]?.message, "Title must not be empty");
  }
});

test("updateItemSchema rejects empty payload", () => {
  const result = updateItemSchema.safeParse({});

  assert.equal(result.success, false);
  if (!result.success) {
    assert.equal(
      result.error.issues[0]?.message,
      "Provide at least one of: title, description, status.",
    );
  }
});
