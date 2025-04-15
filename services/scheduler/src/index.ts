import prisma from "@repo/db/client"
import {CronExpressionParser} from "cron-parser"
import { jobQueue } from "@repo/queue"

console.log("scheduler running")
const INTERVAL = 60_000
let lastRun = new Date()

async function checkScheduledJobs() {
  console.log("Starting scheduled job check")
  const now = new Date()
  console.log(`Checking jobs between ${lastRun.toISOString()} and ${now.toISOString()}`)

  const jobs = await prisma.job.findMany({where: {
    schedule: {not: null},
    isActive: true
  }})
  console.log(`Found ${jobs.length} scheduled jobs to check`)

  for (const job of jobs) {
    try {
      console.log(`Processing job ${job.name} (ID: ${job.id})`)
      const interval = CronExpressionParser.parse(job.schedule!, {currentDate: lastRun})
      const next = interval.next().toDate()
      console.log(`Next scheduled run for ${job.name}: ${next.toISOString()}`)

      if(next >= lastRun && next <= now) {

        const jobRun = await prisma.jobRun.create({
          data: {
            jobId: job.id,
            trigger: 'scheduler',
            status: "queued",
            logs: "",
            exitCode: 0
          }
        })

        await jobQueue.add("run-job", {
          id: job.id,
          jobRunId: jobRun.id,
          name: job.name,
          image: job.image,
          command: job.command,
          env: job.env,
          trigger: "scheduler"
        })
        console.log(`Successfully queued job ${job.name}`)
      } else {
        console.log(`Job ${job.name} not due for execution yet`)
      }
    } catch (error) {
      console.error(`Error processing job ${job.name}:`, error)
    }
  }
  lastRun = now
  console.log("Completed scheduled job check")
}

console.log(`Starting scheduler with ${INTERVAL}ms interval`)
setInterval(checkScheduledJobs, INTERVAL)