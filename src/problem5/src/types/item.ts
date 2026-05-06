/** API-facing item shape (ISO date strings after JSON serialization). */
export interface Item {
  id: string;
  title: string;
  description: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface ListItemsQuery {
  status?: string;
  q?: string;
  limit?: string;
  offset?: string;
}
