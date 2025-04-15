"use client"

import { useLogStream } from "../hooks/useLogStream";

export default function WssTest() {
  const { logs, connected } = useLogStream("abc123");

  return (
    <div className="font-mono bg-black text-green-400 p-4">
      {logs.map((line, i) => (
        <div key={i}>{line}</div>
      ))}
      {!connected && <div className="text-red-400">Disconnected</div>}
      {connected && <div className="text-green-400">Connected</div>}
    </div>
  );
}
