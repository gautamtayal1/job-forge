import { Worker } from "bullmq"
import { connection } from "@repo/queue"

const worker = new Worker("job-runner", async(job) => {
  console.log("running job: ", job.name)

}, {
  connection,
  concurrency: 2
})

worker.on("completed", (job) => {
  console.log("job completed: ", job.name)
})

worker.on("failed", (job, error) => {
  console.log("job failed: ", job?.name, error)
})

