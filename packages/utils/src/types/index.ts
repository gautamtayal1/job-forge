import { z } from "zod";
import { JobSchema } from "../schema/jobs.js";

export type JobPayload = z.infer<typeof JobSchema>