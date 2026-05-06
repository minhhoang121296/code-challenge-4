import type { NextFunction, Request, Response } from "express";
import type { z } from "zod";

export function validateBody<T extends z.ZodTypeAny>(schema: T) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({
        error: "Validation failed",
        details: result.error.issues.map((issue) => ({
          path: issue.path.length > 0 ? issue.path.map(String).join(".") : "(root)",
          message: issue.message,
        })),
      });
      return;
    }
    req.body = result.data as Request["body"];
    next();
  };
}
