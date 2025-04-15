
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, X, ArrowLeft } from "lucide-react";

// Mock initial YAML
const initialYaml = `name: my-job
image: node:16
command:
  - npm install
  - npm run build
  - npm test
env:
  NODE_ENV: production
  API_URL: https://api.example.com
  DEBUG: "false"
schedule: "0 0 * * *" # Daily at midnight
`;

function FormEditor() {
  const [envVars, setEnvVars] = useState([
    { key: "NODE_ENV", value: "production" },
    { key: "API_URL", value: "https://api.example.com" },
    { key: "DEBUG", value: "false" }
  ]);

  const [commands, setCommands] = useState([
    "npm install",
    "npm run build",
    "npm test"
  ]);

  const addEnvVar = () => {
    setEnvVars([...envVars, { key: "", value: "" }]);
  };

  const removeEnvVar = (index: number) => {
    setEnvVars(envVars.filter((_, i) => i !== index));
  };

  const updateEnvVar = (index: number, field: 'key' | 'value', value: string) => {
    const updated = [...envVars];
    updated[index][field] = value;
    setEnvVars(updated);
  };

  const addCommand = () => {
    setCommands([...commands, ""]);
  };

  const removeCommand = (index: number) => {
    setCommands(commands.filter((_, i) => i !== index));
  };

  const updateCommand = (index: number, value: string) => {
    const updated = [...commands];
    updated[index] = value;
    setCommands(updated);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name">Job Name</Label>
          <Input id="name" placeholder="my-job" defaultValue="my-job" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="image">Container Image</Label>
          <Input id="image" placeholder="node:16" defaultValue="node:16" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="schedule">Schedule (cron format)</Label>
          <Input id="schedule" placeholder="0 0 * * *" defaultValue="0 0 * * *" />
          <p className="text-xs text-muted-foreground">Daily at midnight (0 0 * * *)</p>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label>Commands</Label>
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              onClick={addCommand}
              className="h-7 px-2"
            >
              <PlusCircle className="h-3.5 w-3.5 mr-1" />
              Add Command
            </Button>
          </div>
          <div className="space-y-2">
            {commands.map((command, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={command}
                  onChange={(e) => updateCommand(index, e.target.value)}
                  placeholder="Enter command"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeCommand(index)}
                  className="h-10 w-10"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label>Environment Variables</Label>
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              onClick={addEnvVar}
              className="h-7 px-2"
            >
              <PlusCircle className="h-3.5 w-3.5 mr-1" />
              Add Variable
            </Button>
          </div>
          <div className="space-y-2">
            {envVars.map((env, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={env.key}
                  onChange={(e) => updateEnvVar(index, 'key', e.target.value)}
                  placeholder="Key"
                  className="w-1/3"
                />
                <Input
                  value={env.value}
                  onChange={(e) => updateEnvVar(index, 'value', e.target.value)}
                  placeholder="Value"
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeEnvVar(index)}
                  className="h-10 w-10"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function YamlEditor() {
  const [yaml, setYaml] = useState(initialYaml);

  return (
    <div className="space-y-4">
      <div className="bg-secondary/50 rounded-md">
        <textarea
          className="w-full h-[500px] p-4 bg-transparent border-0 font-mono text-sm focus:outline-none focus:ring-0"
          value={yaml}
          onChange={(e) => setYaml(e.target.value)}
        />
      </div>
    </div>
  );
}

export default function CreateJob() {
  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Link to="/" className="text-muted-foreground hover:text-foreground">
            Dashboard
          </Link>
          <span className="text-muted-foreground">/</span>
          <span>Create Job</span>
        </div>
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Create Job</h1>
          <Link to="/">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Tabs defaultValue="form">
            <TabsList className="mb-4">
              <TabsTrigger value="form">Form</TabsTrigger>
              <TabsTrigger value="yaml">YAML</TabsTrigger>
            </TabsList>
            <TabsContent value="form">
              <FormEditor />
            </TabsContent>
            <TabsContent value="yaml">
              <YamlEditor />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        <Button variant="outline">Cancel</Button>
        <Button>Create Job</Button>
      </div>
    </div>
  );
}
