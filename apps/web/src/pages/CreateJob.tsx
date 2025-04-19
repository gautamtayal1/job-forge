import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, X, ArrowLeft } from "lucide-react";
import axios from "axios";
import { useUser } from "@clerk/clerk-react";

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

export default function CreateJob() {
  const { user } = useUser();
  const [name, setName] = useState("my-job");
  const [image, setImage] = useState("node:16");
  const [schedule, setSchedule] = useState("0 0 * * *");
  const [envVars, setEnvVars] = useState([
    { key: "NODE_ENV", value: "production" },
    { key: "API_URL", value: "https://api.example.com" },
    { key: "DEBUG", value: "false" }
  ]);
  const [tab, setTab] = useState("form");
  const [commands, setCommands] = useState([
    "npm install",
    "npm run build",
    "npm test"
  ]);
  const [yaml, setYaml] = useState(initialYaml);

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

  function parseJobYaml(yamlString: string) {
    try {
      const lines = yamlString.split('\n');
      const result = {
        name: '',
        image: '',
        schedule: '',
        env: [],
        command: [],
        userMail: user?.emailAddresses[0].emailAddress
      };
      
      let currentSection = null;
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        
        if (!line || line.startsWith('#')) continue;
        
        if (line.startsWith('name:')) {
          result.name = line.substring(5).trim();
        } else if (line.startsWith('image:')) {
          result.image = line.substring(6).trim();
        } else if (line.startsWith('schedule:')) {
          let scheduleValue = line.substring(9).trim();
          if (scheduleValue.startsWith('"') && scheduleValue.includes('"')) {
            scheduleValue = scheduleValue.split('"')[1];
          } else if (scheduleValue.startsWith("'") && scheduleValue.includes("'")) {
            scheduleValue = scheduleValue.split("'")[1];
          }
          scheduleValue = scheduleValue.split('#')[0].trim();
          result.schedule = scheduleValue;
        } else if (line.startsWith('command:')) {
          currentSection = 'command';
        } else if (line.startsWith('env:')) {
          currentSection = 'env';
        } else if (line.startsWith('- ') && currentSection === 'command') {
          result.commands.push(line.substring(2).trim());
        } else if (currentSection === 'env' && line.includes(':')) {
          const parts = line.split(':');
          const key = parts[0].trim();
          let value = parts.slice(1).join(':').trim();
          
          if (value.startsWith('"') && value.endsWith('"')) {
            value = value.slice(1, -1);
          } else if (value.startsWith("'") && value.endsWith("'")) {
            value = value.slice(1, -1);
          }
          
          result.envVars.push({ key, value });
        }
      }
      
      return result;
    } catch (error) {
      console.error("Error parsing YAML:", error);
      return null;
    }
  }

  const handleCreateJob = () => {
    console.log(name, image, schedule, envVars, commands, yaml);
    console.log(parseJobYaml(yaml));

    if (tab === "form") {
      const submit = async () => {
        const response = await axios.post("http://localhost:8080/jobs", {
          name,
          image,
          schedule: schedule ? schedule : null,
          env: envVars,
          command: commands,
          userMail: user?.emailAddresses[0].emailAddress
        });
        console.log(response.data);
      };
      submit();
    } else {
      const submit = async () => {
        const response = await axios.post("http://localhost:8080/jobs", {
          ...parseJobYaml(yaml),
        });
        console.log(response.data); 
      };
      submit();
    }
  };

  const renderFormEditor = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name">Job Name</Label>
          <Input 
            id="name" 
            placeholder="my-job" 
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="image">Container Image</Label>
          <Input 
            id="image" 
            placeholder="node:16" 
            value={image}
            onChange={(e) => setImage(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="schedule">Schedule (cron format)</Label>
          <Input 
            id="schedule" 
            placeholder="0 0 * * *" 
            value={schedule}
            onChange={(e) => setSchedule(e.target.value)}
          />
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

  const renderYamlEditor = () => (
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
              <TabsTrigger value="form" onClick={() => setTab("form")}>Form</TabsTrigger>
              <TabsTrigger value="yaml" onClick={() => setTab("yaml")}>YAML</TabsTrigger>
            </TabsList>
            <TabsContent value="form">
              {renderFormEditor()}
            </TabsContent>
            <TabsContent value="yaml">
              {renderYamlEditor()}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        <Button variant="outline">Cancel</Button>
        <Button onClick={handleCreateJob}>Create Job</Button>
      </div>
    </div>
  );
} 
