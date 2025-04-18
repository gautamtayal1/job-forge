import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge, JobStatus } from "@/components/status-badge";
import { 
  Play, 
  RefreshCw, 
  Calendar, 
  Terminal,
  Clock
} from "lucide-react";

interface JobDetail {
  id: string;
  name: string;
  image: string;
  environment: { key: string; value: string }[];
  lastRunStatus: JobStatus;
  lastRunTime: string;
  triggerType: string;
  createdAt: string;
}

interface JobRun {
  id: string;
  status: JobStatus;
  timestamp: string;
  duration: string;
  trigger: string;
}

// Mock data
const job: JobDetail = {
  id: "job-1",
  name: "Deploy Website",
  image: "node:16",
  environment: [
    { key: "NODE_ENV", value: "production" },
    { key: "API_URL", value: "https://api.example.com" },
    { key: "DEBUG", value: "false" }
  ],
  lastRunStatus: "completed",
  lastRunTime: "2023-04-15T12:00:00Z",
  triggerType: "manual",
  createdAt: "2023-01-10T08:30:00Z"
};

const runs: JobRun[] = [
  {
    id: "run-101",
    status: "completed",
    timestamp: "2023-04-15T12:00:00Z",
    duration: "1m 20s",
    trigger: "manual"
  },
  {
    id: "run-100",
    status: "failed",
    timestamp: "2023-04-14T09:45:00Z",
    duration: "0m 45s",
    trigger: "scheduler"
  },
  {
    id: "run-99",
    status: "completed",
    timestamp: "2023-04-13T15:30:00Z",
    duration: "1m 15s",
    trigger: "manual"
  },
  {
    id: "run-98",
    status: "completed",
    timestamp: "2023-04-12T11:20:00Z",
    duration: "1m 10s",
    trigger: "scheduler"
  },
  {
    id: "run-97",
    status: "failed",
    timestamp: "2023-04-11T16:40:00Z",
    duration: "0m 30s",
    trigger: "manual"
  }
];

export default function JobDetails() {
  const { jobId } = useParams();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link to="/" className="text-muted-foreground hover:text-foreground">
              Dashboard
            </Link>
            <span className="text-muted-foreground">/</span>
            <span>Job Details</span>
          </div>
          <h1 className="text-3xl font-bold">{job.name}</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Play className="w-4 h-4 mr-2" />
            Run
          </Button>
          <Button variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Rerun
          </Button>
          <Button variant="outline">
            <Calendar className="w-4 h-4 mr-2" />
            Schedule
          </Button>
          <Button>
            Edit Job
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Job Info</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-4">
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Status</dt>
                <dd className="mt-1">
                  <StatusBadge status={job.lastRunStatus} />
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Last Run</dt>
                <dd className="mt-1">{new Date(job.lastRunTime).toLocaleString()}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Trigger Type</dt>
                <dd className="mt-1 capitalize">{job.triggerType}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Created</dt>
                <dd className="mt-1">{new Date(job.createdAt).toLocaleDateString()}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Image</dt>
                <dd className="mt-1 font-mono text-sm">{job.image}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Environment Variables</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-secondary/50 rounded-md p-4 font-mono text-sm">
              {job.environment.map((env, index) => (
                <div key={index} className="flex">
                  <span className="text-primary">{env.key}</span>
                  <span className="text-muted-foreground mx-2">=</span>
                  <span>"{env.value}"</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Recent Runs</h2>
        <div className="border rounded-md overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-secondary text-secondary-foreground">
                <th className="text-left py-3 px-4">Run ID</th>
                <th className="text-left py-3 px-4">Status</th>
                <th className="text-left py-3 px-4">Timestamp</th>
                <th className="text-left py-3 px-4">Duration</th>
                <th className="text-left py-3 px-4">Trigger</th>
                <th className="text-right py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {runs.map((run) => (
                <tr key={run.id} className="border-t hover:bg-muted/50">
                  <td className="py-3 px-4 font-mono">
                    <Link to={`/jobs/${jobId}/runs/${run.id}`} className="font-medium hover:text-primary">
                      {run.id}
                    </Link>
                  </td>
                  <td className="py-3 px-4">
                    <StatusBadge status={run.status} />
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">
                    {new Date(run.timestamp).toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {run.duration}
                    </div>
                  </td>
                  <td className="py-3 px-4 capitalize text-muted-foreground">
                    {run.trigger}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Link to={`/jobs/${jobId}/runs/${run.id}`}>
                      <Button variant="ghost" size="sm">
                        <Terminal className="h-4 w-4 mr-1" />
                        View Logs
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
