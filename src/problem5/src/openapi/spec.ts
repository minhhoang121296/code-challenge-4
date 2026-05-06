/** OpenAPI 3.0 document for Problem 5 Items API */
export const openApiDocument = {
  openapi: "3.0.3",
  info: {
    title: "Problem 5 Items API",
    description:
      "CRUD HTTP API for items. PostgreSQL via Prisma; JSON uses camelCase (`createdAt`, `updatedAt`). Request bodies for create/update are validated with **Zod**.",
    version: "1.0.0",
  },
  servers: [{ url: "/", description: "Same origin as this UI (use your server host when calling from outside)" }],
  tags: [
    { name: "Health", description: "Service health" },
    { name: "Items", description: "Item resources" },
  ],
  paths: {
    "/health": {
      get: {
        tags: ["Health"],
        summary: "Health check",
        operationId: "getHealth",
        responses: {
          "200": {
            description: "OK",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Health" },
                examples: {
                  default: { value: { ok: true } },
                },
              },
            },
          },
        },
      },
    },
    "/api/items": {
      get: {
        tags: ["Items"],
        summary: "List items",
        description: "Returns a paginated list with optional filters.",
        operationId: "listItems",
        parameters: [
          {
            name: "status",
            in: "query",
            description: "Exact match on `status`",
            schema: { type: "string" },
          },
          {
            name: "q",
            in: "query",
            description: "Case-insensitive search in `title` and `description`",
            schema: { type: "string" },
          },
          {
            name: "limit",
            in: "query",
            description: "Page size (default 50, max 100)",
            schema: { type: "integer", minimum: 1, maximum: 100, default: 50 },
          },
          {
            name: "offset",
            in: "query",
            description: "Pagination offset",
            schema: { type: "integer", minimum: 0, default: 0 },
          },
        ],
        responses: {
          "200": {
            description: "List of items",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ItemListResponse" },
              },
            },
          },
          "500": {
            description: "Server error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorBody" },
              },
            },
          },
        },
      },
      post: {
        tags: ["Items"],
        summary: "Create an item",
        operationId: "createItem",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ItemCreate" },
            },
          },
        },
        responses: {
          "201": {
            description: "Created",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Item" },
              },
            },
          },
          "400": {
            description: "Invalid JSON body (Zod)",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ValidationErrorBody" },
              },
            },
          },
          "500": {
            description: "Server error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorBody" },
              },
            },
          },
        },
      },
    },
    "/api/items/{id}": {
      get: {
        tags: ["Items"],
        summary: "Get item by id",
        operationId: "getItemById",
        parameters: [{ $ref: "#/components/parameters/ItemId" }],
        responses: {
          "200": {
            description: "Found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Item" },
              },
            },
          },
          "400": {
            description: "Invalid or non-UUID id",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorBody" },
              },
            },
          },
          "404": {
            description: "Not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorBody" },
              },
            },
          },
          "500": {
            description: "Server error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorBody" },
              },
            },
          },
        },
      },
      put: {
        tags: ["Items"],
        summary: "Update an item",
        description: "Send at least one of `title`, `description`, `status`.",
        operationId: "updateItem",
        parameters: [{ $ref: "#/components/parameters/ItemId" }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ItemUpdate" },
            },
          },
        },
        responses: {
          "200": {
            description: "Updated",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Item" },
              },
            },
          },
          "400": {
            description: "Invalid JSON body (Zod), invalid id, or empty update object",
            content: {
              "application/json": {
                schema: {
                  oneOf: [
                    { $ref: "#/components/schemas/ValidationErrorBody" },
                    { $ref: "#/components/schemas/ErrorBody" },
                  ],
                },
              },
            },
          },
          "404": {
            description: "Not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorBody" },
              },
            },
          },
          "500": {
            description: "Server error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorBody" },
              },
            },
          },
        },
      },
      delete: {
        tags: ["Items"],
        summary: "Delete an item",
        operationId: "deleteItem",
        parameters: [{ $ref: "#/components/parameters/ItemId" }],
        responses: {
          "204": {
            description: "Deleted (no body)",
          },
          "400": {
            description: "Invalid or non-UUID id",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorBody" },
              },
            },
          },
          "404": {
            description: "Not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorBody" },
              },
            },
          },
          "500": {
            description: "Server error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorBody" },
              },
            },
          },
        },
      },
    },
  },
  components: {
    parameters: {
      ItemId: {
        name: "id",
        in: "path",
        required: true,
        description: "Item UUID",
        schema: { type: "string", format: "uuid" },
      },
    },
    schemas: {
      Health: {
        type: "object",
        required: ["ok"],
        properties: {
          ok: { type: "boolean", example: true },
        },
      },
      ErrorBody: {
        type: "object",
        properties: {
          error: { type: "string", example: "Resource not found." },
        },
      },
      ValidationErrorBody: {
        type: "object",
        required: ["error", "details"],
        properties: {
          error: { type: "string", enum: ["Validation failed"] },
          details: {
            type: "array",
            items: {
              type: "object",
              required: ["path", "message"],
              properties: {
                path: { type: "string", example: "title" },
                message: { type: "string", example: "Title must not be empty" },
              },
            },
          },
        },
      },
      Item: {
        type: "object",
        required: ["id", "title", "description", "status", "createdAt", "updatedAt"],
        properties: {
          id: { type: "string", format: "uuid" },
          title: { type: "string" },
          description: { type: "string", nullable: true },
          status: { type: "string", example: "active" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      ItemCreate: {
        type: "object",
        required: ["title"],
        properties: {
          title: { type: "string", minLength: 1 },
          description: { type: "string", nullable: true },
          status: { type: "string", description: "Defaults to `active` if omitted" },
        },
      },
      ItemUpdate: {
        type: "object",
        minProperties: 1,
        properties: {
          title: { type: "string", minLength: 1 },
          description: { type: "string", nullable: true },
          status: { type: "string", minLength: 1 },
        },
      },
      ItemListResponse: {
        type: "object",
        required: ["items", "total", "limit", "offset"],
        properties: {
          items: {
            type: "array",
            items: { $ref: "#/components/schemas/Item" },
          },
          total: { type: "integer", minimum: 0 },
          limit: { type: "integer", minimum: 1 },
          offset: { type: "integer", minimum: 0 },
        },
      },
    },
  },
} as const;
