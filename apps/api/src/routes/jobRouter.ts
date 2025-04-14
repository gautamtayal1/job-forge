import { Router } from "express";
import YAML from "yaml";
import { JobPayload, JobSchema } from "@repo/utils"
import prisma from "@repo/db/client"

const jobRouter: Router = Router()

jobRouter.post("/", async(req, res) => {
  try {
    const yaml = req.body.yaml
    const parsedYaml = YAML.parse(yaml)
    const parsedJob = JobSchema.parse(parsedYaml)

    const job = await prisma.job.create({data: parsedJob})
    res.status(201).json({message: "job created successfully", data: job})

  } catch (error) {
    console.error(error)
    res.status(400).json({ message: "Invalid job definition" })
  }
})

jobRouter.post("/:id/run", async (req, res) => {
  const jobId = req.params.id

  try {
    const job = await prisma.job.findUnique({
      where: {
        id: jobId
      }
    })
    
    if (!job) {
      res.status(404).json({error: "Job not found"})
      return
    }

    const payload: JobPayload = {
      name: job.name,
      image: job.image,
      command: job.command,
      env: job.env as Record<string, string>,
      timeout: job.timeout ?? undefined,
      retries: job?.retries ?? undefined,
    }

    // await jobQueue.add("run-job", payload)

    res.status(201).json({message: "job queued successfully"})
  } catch (error) {
    console.log(error)
    res.status(500).json({error: "Failed to queue the order"})
  }
})

export { jobRouter }



