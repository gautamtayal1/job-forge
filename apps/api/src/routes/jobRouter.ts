import { Router } from "express";
import YAML from "yaml";
import { JobSchema } from "@repo/utils"
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

export { jobRouter }



