
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Settings, 
  PlayCircle, 
  PlusCircle,
  Terminal,
  Server
} from "lucide-react";

interface NavItemProps {
  href: string;
  title: string;
  icon: React.ElementType;
  isActive?: boolean;
}

function NavItem({ href, title, icon: Icon, isActive }: NavItemProps) {
  return (
    <Link
      to={href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:text-primary",
        isActive
          ? "bg-secondary text-primary font-medium"
          : "text-muted-foreground"
      )}
    >
      <Icon className="h-4 w-4" />
      <span>{title}</span>
    </Link>
  );
}

export function SidebarNav() {
  const location = useLocation();

  const navItems = [
    {
      title: "Dashboard",
      href: "/",
      icon: LayoutDashboard,
    },
    {
      title: "Jobs",
      href: "/jobs",
      icon: PlayCircle,
    },
    {
      title: "Create Job",
      href: "/jobs/create",
      icon: PlusCircle,
    },
    {
      title: "Logs",
      href: "/logs",
      icon: Terminal,
    },
    {
      title: "Runners",
      href: "/runners",
      icon: Server,
    },
    {
      title: "Settings",
      href: "/settings",
      icon: Settings,
    }
  ];

  return (
    <div className="flex h-screen flex-col border-r bg-sidebar">
      <div className="p-6">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <div className="h-7 w-7 rounded-md bg-primary flex items-center justify-center text-primary-foreground">
            JF
          </div>
          <span className="text-xl font-bold">JobForge</span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid gap-1 px-2">
          {navItems.map((item) => (
            <NavItem
              key={item.href}
              href={item.href}
              title={item.title}
              icon={item.icon}
              isActive={location.pathname === item.href}
            />
          ))}
        </nav>
      </div>
      <div className="mt-auto p-4 border-t">
        <div className="flex items-center gap-3 rounded-lg px-3 py-2">
          <div className="h-8 w-8 rounded-full bg-secondary" />
          <div>
            <p className="text-sm font-medium">dev@example.com</p>
            <p className="text-xs text-muted-foreground">Administrator</p>
          </div>
        </div>
      </div>
    </div>
  );
}
