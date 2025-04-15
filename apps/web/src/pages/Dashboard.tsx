
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/status-badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  Search, 
  Calendar,
  Play,
  RefreshCw
} from "lucide-react";

// Mock data
const jobs = [
  {
    id: "job-1",
    name: "Deploy Website",
    triggerType: "manual",
    isActive: true,
    lastRunStatus: "completed",
    lastRunTime: "2023-04-15T12:00:00Z"
  },
  {
    id: "job-2",
    name: "Backup Database",
    triggerType: "scheduler",
    isActive: true,
    lastRunStatus: "failed",
    lastRunTime: "2023-04-15T10:30:00Z"
  },
  {
    id: "job-3",
    name: "Generate Reports",
    triggerType: "scheduler",
    isActive: false,
    lastRunStatus: "queued",
    lastRunTime: "2023-04-16T08:00:00Z"
  },
  {
    id: "job-4",
    name: "Data Migration",
    triggerType: "manual",
    isActive: true,
    lastRunStatus: "running",
    lastRunTime: "2023-04-15T14:15:00Z"
  },
  {
    id: "job-5",
    name: "Security Scan",
    triggerType: "scheduler",
    isActive: true,
    lastRunStatus: "completed",
    lastRunTime: "2023-04-14T23:00:00Z"
  }
];

function JobsTable() {
  return (
    <div className="border rounded-md overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="bg-secondary text-secondary-foreground">
            <th className="text-left py-3 px-4">Name</th>
            <th className="text-left py-3 px-4">Trigger Type</th>
            <th className="text-left py-3 px-4">Status</th>
            <th className="text-left py-3 px-4">Last Run</th>
            <th className="text-left py-3 px-4">Active</th>
            <th className="text-right py-3 px-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((job) => (
            <tr key={job.id} className="border-t hover:bg-muted/50">
              <td className="py-3 px-4">
                <a href={`/jobs/${job.id}`} className="font-medium hover:text-primary">
                  {job.name}
                </a>
              </td>
              <td className="py-3 px-4 capitalize text-muted-foreground">
                {job.triggerType}
              </td>
              <td className="py-3 px-4">
                <StatusBadge status={job.lastRunStatus as any} />
              </td>
              <td className="py-3 px-4 text-muted-foreground">
                {new Date(job.lastRunTime).toLocaleString()}
              </td>
              <td className="py-3 px-4">
                <div className="flex items-center space-x-2">
                  <Switch id={`active-${job.id}`} checked={job.isActive} />
                </div>
              </td>
              <td className="py-3 px-4 text-right space-x-2">
                <Button size="sm" variant="outline" className="mr-2">
                  <Play className="h-4 w-4 mr-1" />
                  Run
                </Button>
                <Button size="sm" variant="outline" className="mr-2">
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Rerun
                </Button>
                <Button size="sm" variant="outline">
                  <Calendar className="h-4 w-4 mr-1" />
                  Schedule
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search jobs..." 
              className="pl-10 w-64"
            />
          </div>
          <Button>
            Create Job
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+3 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">75% of total jobs</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">92%</div>
            <p className="text-xs text-muted-foreground">+5% from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Jobs Running</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">2 queued for execution</p>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-xl font-semibold mt-6 mb-4">Jobs</h2>
      <JobsTable />
    </div>
  );
}
