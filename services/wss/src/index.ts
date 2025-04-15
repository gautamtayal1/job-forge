import { WebSocketServer, WebSocket } from "ws";
import { createClient } from "redis";

type ActiveClient = {
  jobRunId: string;
  socket: WebSocket;
}

const sub = createClient({ url: "redis://localhost:6379" })
await sub.connect()

const wss = new WebSocketServer({ port: 8081 })
console.log("WebSocket server listening on port 8081")

const clients: ActiveClient[] = []

wss.on("connection", (socket) => {
  console.log("client connected")

  socket.on("message", async(msg) => {
    try {
      const { type, jobRunId } = JSON.parse(msg.toString())

      if(type === "subscribe" && jobRunId) {
        clients.push({jobRunId, socket})
        console.log("client subscribed to jobRunId: ", jobRunId)
      }
    } catch (error) {
      console.log("Invalid WS message", msg.toString())
    }
  })

  socket.on("close", () => {
    for(let i = clients.length - 1; i >= 0; i--) {
      if(clients[i]?.socket === socket) {
        clients.splice(i, 1)
      }
    }
  })
})
await sub.pSubscribe("job-logs:*", (message, channel) => {
  const jobRunId = channel.split(":")[1]
  clients
    .filter((c) => c.jobRunId === jobRunId)
    .forEach((c) => {
      c.socket.send(JSON.stringify({type: "log", data: message}))
    })
})