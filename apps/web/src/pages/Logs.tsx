import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
 import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
 } from "@/components/ui/select";
 import { Badge } from "@/components/ui/badge";
 import { Card } from "@/components/ui/card";
 import { Search, Download, FilterX } from "lucide-react";
 
 const logs = [
   {
     timestamp: "2024-04-15T10:30:00Z",
     level: "error",
     service: "database",
     message: "Connection timeout after 5 attempts",
   },
   {
     timestamp: "2024-04-15T10:29:45Z",
     level: "info",
     service: "api",
     message: "Request processed successfully: GET /api/users",
   },
   {
     timestamp: "2024-04-15T10:29:30Z",
     level: "warning",
     service: "auth",
     message: "Rate limit threshold reached for IP: 192.168.1.1",
   },
   // Add more log entries...
 ];
 
 export default function Logs() {
   const [filter, setFilter] = useState("all");
 
   return (
     <div className="space-y-6">
       <div className="flex justify-between items-center">
         <h1 className="text-3xl font-bold tracking-tight">System Logs</h1>
         <div className="flex items-center gap-4">
           <Button variant="outline" size="icon">
             <Download className="h-4 w-4" />
           </Button>
           <Button variant="outline" size="icon">
             <FilterX className="h-4 w-4" />
           </Button>
         </div>
       </div>
 
       <div className="flex gap-4 items-center">
         <div className="relative flex-1">
           <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
           <Input placeholder="Search logs..." className="pl-10" />
         </div>
         <Select value={filter} onValueChange={setFilter}>
           <SelectTrigger className="w-[180px]">
             <SelectValue placeholder="Log Level" />
           </SelectTrigger>
           <SelectContent>
             <SelectItem value="all">All Levels</SelectItem>
             <SelectItem value="error">Error</SelectItem>
             <SelectItem value="warning">Warning</SelectItem>
             <SelectItem value="info">Info</SelectItem>
           </SelectContent>
         </Select>
       </div>
 
       <Card className="relative overflow-hidden bg-card">
         <div className="absolute inset-0 bg-gradient-to-r from-background via-accent to-background opacity-10" />
         <div className="relative max-h-[600px] overflow-auto font-mono text-sm p-6 space-y-4">
           {logs.map((log, index) => (
             <div
               key={index}
               className="flex items-start gap-4 p-3 rounded-lg hover:bg-accent/50 transition-colors"
             >
               <Badge
                 variant={
                   log.level === "error"
                     ? "destructive"
                     : log.level === "warning"
                     ? "warning"
                     : "secondary"
                 }
                 className="uppercase text-xs"
               >
                 {log.level}
               </Badge>
               <div className="flex-1 space-y-1">
                 <div className="flex items-center gap-2">
                   <span className="text-muted-foreground">
                     {new Date(log.timestamp).toLocaleString()}
                   </span>
                   <Badge variant="outline" className="text-xs">
                     {log.service}
                   </Badge>
                 </div>
                 <p className="text-sm">{log.message}</p>
               </div>
             </div>
           ))}
         </div>
       </Card>
     </div>
   );
 }