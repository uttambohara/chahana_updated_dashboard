import { PER_PAGE } from "@/lib/constant";
import * as z from "zod";

export const searchParamsSchema = z.object({
  page: z.coerce.number().default(1),
  per_page: z.coerce.number().default(PER_PAGE),
  start: z.coerce.number().optional(),
  end: z.coerce.number().optional(),
  sort: z.string().optional(),
  title: z.string().optional(),
  status: z.string().optional(),
  priority: z.string().optional(),
  from: z.string().optional(),
  to: z.string().optional(),
  //   operator: z.enum(["and", "or"]).optional(),
});

export const getTasksSchema = searchParamsSchema;

export type GetTasksSchema = z.infer<typeof getTasksSchema>;
