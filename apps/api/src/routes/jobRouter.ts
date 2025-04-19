import { Router } from "express";
import YAML from "yaml";
import { JobPayload, JobSchema } from "@repo/utils"
import prisma from "@repo/db/client"
import { jobQueue } from "@repo/queue"
const jobRouter: Router = Router()

jobRouter.post("/", async(req, res) => {
  try {
    const job = await prisma.job.create({ data : req.body })
    res.status(201).json({message: "job created successfully", data: job})

  } catch (error) {
    console.error(error)
    res.status(400).json({ message: "Invalid job definition" })
  }
})

jobRouter.get('/', async (req, res) => {
  const email = req.query.email as string;
  const jobs = await prisma.job.findMany({ 
    where: { 
      userMail: email
    } 
  });
  res.json(jobs);
});

jobRouter.post("/:id/run", async (req, res) => {
  const jobId = req.params.id
  try {
    const job = await prisma.job.findUnique({
      where: {
        id: jobId
      }
    })
    console.log(job)
    if (!job) {
      res.status(404).json({error: "Job not found"})
      return
    }

    const jobRun = await prisma.jobRun.create({
      data: {
        jobId: job.id,
        trigger: "manual",
        status: "queued",
        logs: "",
        exitCode: 0
      }
    })
    console.log(jobRun)

    const payload: JobPayload = {
      jobRunId: jobRun.id,
      name: job.name,
      image: job.image,
      command: job.command,
      env: job.env as Record<string, string>,
      timeout: job.timeout ?? undefined,
      retries: job?.retries ?? undefined,
      isActive: job.isActive
    }
    if (job.isActive) {
        await jobQueue.add("run-job", payload)
    }
    res.status(201).json({message: "job queued successfully"})
  } catch (error) {
    console.log(error)
    res.status(500).json({error: "Failed to queue the order"})
  }
})

jobRouter.get("/:id/runs", async (req, res) => {
  const jobId = req.params.id
  const jobRuns = await prisma.jobRun.findMany({
    where: { jobId: jobId }
  })
  res.json(jobRuns)
})

export { jobRouter }