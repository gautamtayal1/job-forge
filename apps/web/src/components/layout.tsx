
import React from "react";
import { Outlet } from "react-router-dom";
import { SidebarNav } from "./sidebar-nav";

export function Layout() {
  return (
    <div className="flex h-screen bg-background text-foreground">
      <SidebarNav />
      <main className="flex-1 overflow-auto p-8">
        <Outlet />
      </main>
    </div>
  );
}
