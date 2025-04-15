
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/status-badge";
import { ArrowLeft, Download, Clock, CalendarClock } from "lucide-react";

// Mock data for a job run
const jobRun = {
  id: "run-101",
  jobId: "job-1",
  jobName: "Deploy Website",
  status: "completed",
  startTime: "2023-04-15T12:00:00Z",
  endTime: "2023-04-15T12:01:20Z",
  trigger: "manual",
  logs: [
    { timestamp: "2023-04-15T12:00:00.000Z", message: "Starting job execution..." },
    { timestamp: "2023-04-15T12:00:00.100Z", message: "Pulling container image: node:16" },
    { timestamp: "2023-04-15T12:00:05.340Z", message: "Image pulled successfully" },
    { timestamp: "2023-04-15T12:00:05.654Z", message: "Creating container..." },
    { timestamp: "2023-04-15T12:00:06.123Z", message: "Container created" },
    { timestamp: "2023-04-15T12:00:06.234Z", message: "Running command: npm install" },
    { timestamp: "2023-04-15T12:00:45.678Z", message: "Dependencies installed successfully" },
    { timestamp: "2023-04-15T12:00:45.900Z", message: "Running command: npm run build" },
    { timestamp: "2023-04-15T12:01:15.432Z", message: "Build completed successfully" },
    { timestamp: "2023-04-15T12:01:15.675Z", message: "Running command: npm test" },
    { timestamp: "2023-04-15T12:01:19.876Z", message: "Tests passed" },
    { timestamp: "2023-04-15T12:01:20.000Z", message: "Job execution completed with status: SUCCESS" }
  ]
};

function LogViewer({ logs }: { logs: Array<{ timestamp: string; message: string }> }) {
  return (
    <div className="font-mono text-sm bg-black text-white p-4 rounded-md h-[500px] overflow-auto">
      {logs.map((log, index) => {
        const time = new Date(log.timestamp).toISOString().split('T')[1].slice(0, -1);
        return (
          <div key={index} className="pb-1">
            <span className="text-muted-foreground">[{time}]</span> {log.message}
          </div>
        );
      })}
    </div>
  );
}

export default function JobRun() {
  const { jobId, runId } = useParams();
  const [autoScroll, setAutoScroll] = useState(true);

  function calculateDuration(start: string, end: string) {
    const startTime = new Date(start).getTime();
    const endTime = new Date(end).getTime();
    const durationMs = endTime - startTime;
    
    const seconds = Math.floor((durationMs / 1000) % 60);
    const minutes = Math.floor((durationMs / (1000 * 60)) % 60);
    
    return `${minutes}m ${seconds}s`;
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Link to="/" className="text-muted-foreground hover:text-foreground">
            Dashboard
          </Link>
          <span className="text-muted-foreground">/</span>
          <Link to={`/jobs/${jobId}`} className="text-muted-foreground hover:text-foreground">
            {jobRun.jobName}
          </Link>
          <span className="text-muted-foreground">/</span>
          <span>Run {runId}</span>
        </div>
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Job Run: {runId}</h1>
          <Link to={`/jobs/${jobId}`}>
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Job
            </Button>
          </Link>
        </div>
      </div>

      <div className="bg-secondary/50 rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-1">
            <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
            <StatusBadge status={jobRun.status as any} className="mt-1" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-medium text-muted-foreground">Start Time</h3>
            <div className="flex items-center">
              <CalendarClock className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>{new Date(jobRun.startTime).toLocaleString()}</span>
            </div>
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-medium text-muted-foreground">Duration</h3>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>{calculateDuration(jobRun.startTime, jobRun.endTime)}</span>
            </div>
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-medium text-muted-foreground">Trigger</h3>
            <span className="capitalize">{jobRun.trigger}</span>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Logs</h2>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="autoScroll"
                checked={autoScroll}
                onChange={(e) => setAutoScroll(e.target.checked)}
                className="rounded"
              />
              <label htmlFor="autoScroll" className="text-sm">Auto-scroll</label>
            </div>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Download Logs
            </Button>
          </div>
        </div>
        <LogViewer logs={jobRun.logs} />
      </div>
    </div>
  );
}
