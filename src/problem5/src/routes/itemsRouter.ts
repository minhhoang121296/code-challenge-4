import { Prisma } from "@prisma/client";
import { Router, type Request, type Response, type NextFunction } from "express";
import { prisma } from "../db/prisma.js";
import { validateBody } from "../middleware/validateBody.js";
import type { ListItemsQuery } from "../types/item.js";
import { createItemSchema, type CreateItemInput, updateItemSchema, type UpdateItemInput } from "../validation/itemSchemas.js";

export const itemsRouter = Router();

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function paramId(params: Request["params"]): string | undefined {
  const raw = params.id;
  if (typeof raw === "string") return raw;
  if (Array.isArray(raw)) return raw[0];
  return undefined;
}

export function parseLimitOffset(q: ListItemsQuery): { limit: number; offset: number } {
  const limitRaw = q.limit !== undefined ? Number(q.limit) : 50;
  const offsetRaw = q.offset !== undefined ? Number(q.offset) : 0;
  const limit = Number.isFinite(limitRaw) ? Math.min(Math.max(limitRaw, 1), 100) : 50;
  const offset = Number.isFinite(offsetRaw) && offsetRaw >= 0 ? offsetRaw : 0;
  return { limit, offset };
}

export function isUuid(value: string): boolean {
  return UUID_RE.test(value);
}

itemsRouter.post(
  "/",
  validateBody(createItemSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = req.body as CreateItemInput;

      const created = await prisma.item.create({
        data: {
          title: body.title,
          description: body.description ?? null,
          status: body.status ?? "active",
        },
      });

      res.status(201).json(created);
    } catch (err) {
      next(err);
    }
  },
);

itemsRouter.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const q = req.query as unknown as ListItemsQuery;
    const { limit, offset } = parseLimitOffset(q);

    const where: Prisma.ItemWhereInput = {};

    if (typeof q.status === "string" && q.status.length > 0) {
      where.status = q.status;
    }

    if (typeof q.q === "string" && q.q.trim().length > 0) {
      const term = q.q.trim();
      where.OR = [
        { title: { contains: term, mode: "insensitive" } },
        { description: { contains: term, mode: "insensitive" } },
      ];
    }

    const [items, total] = await prisma.$transaction([
      prisma.item.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: offset,
        take: limit,
      }),
      prisma.item.count({ where }),
    ]);

    res.json({
      items,
      total,
      limit,
      offset,
    });
  } catch (err) {
    next(err);
  }
});

itemsRouter.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = paramId(req.params);
    if (!id) {
      res.status(400).json({ error: "Invalid id." });
      return;
    }
    if (!isUuid(id)) {
      res.status(400).json({ error: "Id must be a UUID." });
      return;
    }

    const row = await prisma.item.findUnique({ where: { id } });
    if (!row) {
      res.status(404).json({ error: "Resource not found." });
      return;
    }

    res.json(row);
  } catch (err) {
    next(err);
  }
});

itemsRouter.put(
  "/:id",
  validateBody(updateItemSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = paramId(req.params);
      if (!id) {
        res.status(400).json({ error: "Invalid id." });
        return;
      }
      if (!isUuid(id)) {
        res.status(400).json({ error: "Id must be a UUID." });
        return;
      }

      const body = req.body as UpdateItemInput;
      const data: Prisma.ItemUpdateInput = {};

      if (body.title !== undefined) data.title = body.title;
      if (body.description !== undefined) data.description = body.description;
      if (body.status !== undefined) data.status = body.status;

      try {
        const updated = await prisma.item.update({
          where: { id },
          data,
        });
        res.json(updated);
      } catch (err) {
        if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025") {
          res.status(404).json({ error: "Resource not found." });
          return;
        }
        throw err;
      }
    } catch (err) {
      next(err);
    }
  },
);

itemsRouter.delete("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = paramId(req.params);
    if (!id) {
      res.status(400).json({ error: "Invalid id." });
      return;
    }
    if (!isUuid(id)) {
      res.status(400).json({ error: "Id must be a UUID." });
      return;
    }

    try {
      await prisma.item.delete({ where: { id } });
      res.status(204).send();
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025") {
        res.status(404).json({ error: "Resource not found." });
        return;
      }
      throw err;
    }
  } catch (err) {
    next(err);
  }
});
