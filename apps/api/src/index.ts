import express from "express"
import { jobRouter } from "./routes/jobRouter.js"

const app = express()

app.use(express.json())
app.use("/jobs", jobRouter)

app.listen(8080, () => {
  console.log("Server is running on port 8080")
})
