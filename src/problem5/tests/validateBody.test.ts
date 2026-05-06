import assert from "node:assert/strict";
import test from "node:test";
import type { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { validateBody } from "../src/middleware/validateBody.js";

type MockResponse = Partial<Response> & {
  statusCode?: number;
  payload?: unknown;
};

function createMockResponse(): MockResponse {
  const res: MockResponse = {};
  res.status = (code: number) => {
    res.statusCode = code;
    return res as Response;
  };
  res.json = (payload: unknown) => {
    res.payload = payload;
    return res as Response;
  };
  return res;
}

test("validateBody calls next and replaces body with parsed data", () => {
  const schema = z.object({
    title: z.string().trim().min(1),
  });
  const middleware = validateBody(schema);

  const req = { body: { title: "  hello  " } } as Request;
  const res = createMockResponse() as Response;
  let nextCalled = false;
  const next: NextFunction = () => {
    nextCalled = true;
  };

  middleware(req, res, next);

  assert.equal(nextCalled, true);
  assert.deepEqual(req.body, { title: "hello" });
});

test("validateBody returns 400 with issue details on invalid payload", () => {
  const schema = z.object({
    title: z.string().min(1, "Title is required"),
  });
  const middleware = validateBody(schema);

  const req = { body: { title: "" } } as Request;
  const res = createMockResponse() as Response & MockResponse;
  const next: NextFunction = () => {};

  middleware(req, res, next);

  assert.equal(res.statusCode, 400);
  assert.deepEqual(res.payload, {
    error: "Validation failed",
    details: [{ path: "title", message: "Title is required" }],
  });
});
