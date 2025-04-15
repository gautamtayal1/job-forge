"use client"

import { useEffect, useRef, useState } from "react";

export function useLogStream( jobRunId: string ) {
  const wsRef = useRef<WebSocket | null>(null)
  const [connected, setConnected] = useState(false)
  const [logs, setLogs] = useState<string[]>([])

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8081")
    wsRef.current = ws

    ws.onopen = () => {
      setConnected(true)
      ws.send(JSON.stringify({type: "subscribe", jobRunId}))
    }

    ws.onmessage = (msg) => {
      try {
        const data = JSON.parse(msg.data)
        if (data.type === "logs"){
          setLogs((prev) => [...prev, data.data])
        }
      } catch (err) {
        console.error("invalid ws message: ", msg.data)
      }
    }

    ws.onclose = () => {
      setConnected(false)
    }

    return () => {
      ws.close()
    }
  }, [jobRunId])

  return {logs, connected}
}