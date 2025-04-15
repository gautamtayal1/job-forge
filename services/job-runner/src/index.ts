import { Worker } from "bullmq"
import { connection, jobQueue } from "@repo/queue"
import prisma from "@repo/db/client"
import { exec } from "child_process"

console.log("👂 Worker starting on queue: job-runner");

function runDocker(jobData: any): Promise<string> {
  const {image, command} = jobData
  const cmd = `docker run --rm ${image} ${command.join(" ")}`

  return new Promise((resolve, reject) => {
    exec(cmd, (err, stdout, stderr) => {
      if(err) return reject(stderr)
      resolve(stdout)
    })
  })
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => 
      setTimeout(() => {
        reject(new Error("Job timed out"))
      }, ms))
  ])
}

const worker = new Worker("job-runner", async(job) => {
  console.log("running job: ", job.name ?? job.id)
  const runId = job.data.jobRunId
  const retries = job.data.retries ?? 0
  const timeout = job.data.timeout ?? 30000

  await prisma.jobRun.update({
    where: {id: runId},
    data: {status: "running", startedAt: new Date()}
  })

  try {
    const output = await withTimeout(runDocker(job.data), timeout)

    await prisma.jobRun.update({
      where: {id: runId},
      data: {
        status: "completed",
        logs: output,
        exitCode: 0,
        endedAt: new Date(),
      }
    })
  } catch (error) {
    const errorMsg = error?.toString() ?? "Unknown error"

    if (retries > 0) {
      await jobQueue.add("run-job", {
        ...job.data,
        retries: retries - 1
      })
    }

    await prisma.jobRun.update({
      where: {id: runId},
      data: {
        status: retries > 0 ? "retrying" : "failed",
        logs: errorMsg,
        exitCode: 1,
        endedAt: new Date()
      }
    })
  }
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

