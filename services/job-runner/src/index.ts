import { Worker } from "bullmq"
import { connection, jobQueue } from "@repo/queue"
import prisma from "@repo/db/client"
import { spawn } from "child_process"
import { pub } from "@repo/queue"

console.log("👂 Worker starting on queue: job-runner");

export async function runDockerStream(jobRunId: string, jobData: any): Promise<string> {
  const {image, command} = jobData
  const args = ["run", "--rm", image, ...command]
  const proc = spawn("docker", args)

  let output = ""

  proc.stdout.on("data", (chunk) => {
    const line = chunk.toString()
    output += line
    pub.publish(`job-logs:${jobRunId}`, line)
  })

  proc.stderr.on("data", (chunk) => {
    const line = chunk.toString()
    output += line
    pub.publish(`job-logs:${jobRunId}`, line)
  })

  return new Promise((resolve, reject) => {
    proc.on("close", (code) => {
      if(code === 0) {
        resolve(output)
      } else {
        reject(new Error(`Job exited with code ${code}`))
      } 
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
    const output = await withTimeout(runDockerStream(runId, job.data), timeout)

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

