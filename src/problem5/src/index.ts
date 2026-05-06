import cors from "cors";
import express, { type NextFunction, type Request, type Response } from "express";
import swaggerUi from "swagger-ui-express";
import { env } from "./config/env.js";
import { openApiDocument } from "./openapi/spec.js";
import { itemsRouter } from "./routes/itemsRouter.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/openapi.json", (_req: Request, res: Response) => {
  res.json(openApiDocument);
});

app.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(openApiDocument, {
    customSiteTitle: "Problem 5 API docs",
    customCss: ".swagger-ui .topbar { display: none }",
  }),
);

app.get("/health", (_req: Request, res: Response) => {
  res.json({ ok: true });
});

app.use("/api/items", itemsRouter);

app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  const message = err instanceof Error ? err.message : "Internal Server Error";
  res.status(500).json({ error: message });
});

app.listen(env.port, () => {
  const origin = `http://localhost:${env.port}`;
  console.log(`Server listening on ${origin}`);
  console.log(`API docs: ${origin}/docs/`);
});
