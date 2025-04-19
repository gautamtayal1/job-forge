import express from "express"
import { jobRouter } from "./routes/jobRouter.js"
import cors from "cors"
import webhookRouter from "./routes/webhookRouter.js"
import dotenv from "dotenv"

const app = express()
dotenv.config()

app.use(express.json())
app.use(cors({
  origin: true,
  credentials: true,
}))
app.use(express.urlencoded({ extended: true }))    
app.use("/jobs", jobRouter)
app.use("/api", webhookRouter)

app.listen(8080, () => {
  console.log("Server is running on port 8080")
})
