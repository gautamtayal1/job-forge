import express from "express"
import { jobRouter } from "./routes/jobRouter.js"
import cors from "cors"
const app = express()

app.use(express.json())
app.use(cors({
  origin: true,
  credentials: true,
}))

app.use("/jobs", jobRouter)

app.listen(8080, () => {
  console.log("Server is running on port 8080")
})
