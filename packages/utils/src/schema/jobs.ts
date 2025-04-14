import { z } from "zod";

export const JobSchema = z.object({
  name: z.string(),
  image: z.string(),
  command: z.array(z.string()),
  env: z.record(z.string()),
  schedule: z.string().optional(),
  timeout: z.number().optional(),
  retries: z.number().optional(),
  isActive: z.boolean().optional()
});