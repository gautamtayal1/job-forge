
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/status-badge";
import { 
  ArrowLeft, 
  ChevronDown, 
  ChevronRight, 
  Clock,
  Download
} from "lucide-react";
import { useState } from "react";

const job = {
  id: "job-2",
  name: "Deploy Production Application",
  status: "completed",
  startTime: "2023-04-15T10:30:00Z",
  endTime: "2023-04-15T10:35:25Z",
  steps: [
    {
      id: "step-1",
      name: "Checkout Code",
      status: "completed",
      startTime: "2023-04-15T10:30:00Z",
      endTime: "2023-04-15T10:30:15Z",
      logs: [
        "Cloning repository...",
        "Repository cloned successfully",
        "Checked out branch: main",
        "Step completed successfully"
      ]
    },
    {
      id: "step-2",
      name: "Install Dependencies",
      status: "completed",
      startTime: "2023-04-15T10:30:15Z",
      endTime: "2023-04-15T10:31:45Z",
      logs: [
        "Running npm install...",
        "Added 1200 packages in 1m 30s",
        "Step completed successfully"
      ]
    },
    {
      id: "step-3",
      name: "Run Tests",
      status: "completed",
      startTime: "2023-04-15T10:31:45Z",
      endTime: "2023-04-15T10:33:15Z",
      logs: [
        "Running tests...",
        "Test suite 1: PASSED",
        "Test suite 2: PASSED",
        "Test suite 3: PASSED",
        "All tests passed",
        "Step completed successfully"
      ]
    },
    {
      id: "step-4",
      name: "Build Application",
      status: "completed",
      startTime: "2023-04-15T10:33:15Z",
      endTime: "2023-04-15T10:34:45Z",
      logs: [
        "Building application...",
        "Webpack compilation started",
        "Optimizing assets...",
        "Build completed",
        "Step completed successfully"
      ]
    },
    {
      id: "step-5",
      name: "Deploy to Production",
      status: "completed",
      startTime: "2023-04-15T10:34:45Z",
      endTime: "2023-04-15T10:35:25Z",
      logs: [
        "Starting deployment...",
        "Uploading assets...",
        "Updating database schemas...",
        "Restarting services...",
        "Deployment successful",
        "Step completed successfully"
      ]
    }
  ]
};

function calculateDuration(start: string, end: string) {
  const startTime = new Date(start).getTime();
  const endTime = new Date(end).getTime();
  const durationMs = endTime - startTime;
  
  const seconds = Math.floor((durationMs / 1000) % 60);
  const minutes = Math.floor((durationMs / (1000 * 60)) % 60);
  
  return `${minutes}m ${seconds}s`;
}

interface StepLogProps {
  logs: string[];
}

function StepLog({ logs }: StepLogProps) {
  return (
    <div className="font-mono text-sm bg-black text-white p-4 rounded-md max-h-[200px] overflow-auto">
      {logs.map((log, index) => (
        <div key={index} className="pb-1">
          {log}
        </div>
      ))}
    </div>
  );
}

interface JobStepProps {
  step: typeof job.steps[0];
  index: number;
}

function JobStep({ step, index }: JobStepProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div>
      <div 
        className="flex items-center p-4 bg-secondary/50 rounded-lg cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="mr-4 w-8 h-8 rounded-full bg-muted flex items-center justify-center">
          {index + 1}
        </div>
        <div className="flex-1">
          <h3 className="font-medium">{step.name}</h3>
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="h-3 w-3 mr-1" />
            {calculateDuration(step.startTime, step.endTime)}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge status={step.status as any} />
          {expanded ? (
            <ChevronDown className="h-5 w-5" />
          ) : (
            <ChevronRight className="h-5 w-5" />
          )}
        </div>
      </div>
      {expanded && (
        <div className="mt-2 ml-12 mr-2 mb-4">
          <StepLog logs={step.logs} />
        </div>
      )}
    </div>
  );
}

export default function MultiStepJob() {
  const { jobId } = useParams();

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Link to="/" className="text-muted-foreground hover:text-foreground">
            Dashboard
          </Link>
          <span className="text-muted-foreground">/</span>
          <Link to={`/jobs/${jobId}`} className="text-muted-foreground hover:text-foreground">
            {job.name}
          </Link>
          <span className="text-muted-foreground">/</span>
          <span>Steps</span>
        </div>
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Multi-Step Job Run</h1>
          <Link to={`/jobs/${jobId}`}>
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Job
            </Button>
          </Link>
        </div>
      </div>

      <div className="bg-card p-4 rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-4">
            <StatusBadge status={job.status as any} />
            <h2 className="text-xl font-semibold">{job.name}</h2>
          </div>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Download All Logs
          </Button>
        </div>

        <div className="flex flex-wrap gap-4 mb-6 text-sm">
          <div>
            <span className="text-muted-foreground">Started:</span> {new Date(job.startTime).toLocaleString()}
          </div>
          <div>
            <span className="text-muted-foreground">Completed:</span> {new Date(job.endTime).toLocaleString()}
          </div>
          <div>
            <span className="text-muted-foreground">Duration:</span> {calculateDuration(job.startTime, job.endTime)}
          </div>
          <div>
            <span className="text-muted-foreground">Steps:</span> {job.steps.length}
          </div>
        </div>

        <div className="space-y-2">
          {job.steps.map((step, index) => (
            <JobStep key={step.id} step={step} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
}
