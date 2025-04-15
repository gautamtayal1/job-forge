import { createClient } from "redis";

export const pub = createClient({
  url: "redis://localhost:6379"
}) as ReturnType<typeof createClient>

pub.on("error", (err) => console.error("redis pub error", err))
pub.on("connect", () => console.log("redis pub connected"))

await pub.connect()