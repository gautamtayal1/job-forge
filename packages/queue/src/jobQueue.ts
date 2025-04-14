import { Queue } from "bullmq";
import { connection } from "./connections.js";

export const jobQueue = new Queue("job-runner", { connection })