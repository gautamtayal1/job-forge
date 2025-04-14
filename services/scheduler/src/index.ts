import prisma from "@repo/db/client"
import {CronExpressionParser} from "cron-parser"

const INTERVAL = 60_000
let lastRun = new Date()

async function checkScheduledJobs() {
  const now = new Date()

  const jobs = await prisma.job.findMany({where: {
    schedule: {not: null},
    isActive: true
  }})

  for (const job of jobs) {
    try {
      const interval = CronExpressionParser.parse(job.schedule!, {currentDate: lastRun})
      const next = interval.next().toDate()

      if(next >= lastRun && next <= now) {
        await jobQueue.add("run-job", {
          id: job.id,
          name: job.name,
          image: job.image,
          command: job.command,
          env: job.env,
          trigger: "scheduler"
        })
      }
    } catch (error) {
      console.error("error parsing cron for job: " + error)
    }
  }
  lastRun = now
}

setInterval(checkScheduledJobs, INTERVAL)