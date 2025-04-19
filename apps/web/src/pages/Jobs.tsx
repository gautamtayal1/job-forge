import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { JobStatus } from "@/components/status-badge";
import { Card, CardContent } from "@/components/ui/card";
import { Search } from "lucide-react";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface Job {
  id: string;
  name: string;
  description: string;
  lastRun: string;
  nextRun: string;
  status: JobStatus;
}

export default function Jobs() {
  const [jobs, setJobs] = useState<Job[]>([])
    useEffect(() => { 
        const fetchJobs = async () => {
            const jobs = await axios.get("http://localhost:8080/jobs", {
              params: {
                userId: "test-user"
              }
            })
            setJobs(jobs.data)
        }
        fetchJobs()
    }, [])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Jobs</h1>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search jobs..." className="pl-10 w-64" />
          </div>
          <Button asChild>
            <a href="/jobs/create">Create New Job</a>
          </Button>
        </div>
      </div>

      <div className="grid gap-4">
        {jobs.map((job) => (
          <Card key={job.id} className="hover:bg-muted/50 transition-colors">
            <CardContent className="flex items-center justify-between p-6">
              <div className="space-y-1">
                <Link to={`/jobs/${job.id}`} className="hover:text-primary">
                  <h3 className="font-semibold">{job.name}</h3>
                  <p className="text-sm text-muted-foreground">{job.description}</p>
                </Link>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="bg-primary/10 hover:bg-primary/20 text-primary"
                    // onClick={() => handleRunJob(job.id)}
                  >
                    Run
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="bg-primary/10 hover:bg-primary/20 text-primary"
                    // onClick={() => handleScheduleJob(job.id)}
                  >
                    Schedule
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}