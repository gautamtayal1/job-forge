import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  LogOut, 
  PlayCircle, 
  PlusCircle,
  Terminal,
} from "lucide-react";
import { Button } from "./ui/button";
import { SignedIn, SignedOut, SignInButton, SignOutButton, UserButton, useUser } from "@clerk/clerk-react";

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
  const { user } = useUser();

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
    }
  ];

  return (
    <div className="flex h-screen flex-col border-r bg-sidebar">
      <div className="p-6">
        <Link to="/" className="flex items-center gap-4 font-semibold">
          <div className="h-7 w-7 rounded-md bg-primary flex items-center justify-center text-primary-foreground">
            DR
          </div>
          <span className="text-2xl font-bold">JobForge</span>
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
        <div className="flex items-center gap-3">
          
        </div>
        <div className="flex items-center gap-3">
          
            <SignedOut> 
            
                <SignInButton>
                  <Button variant="ghost" className="w-full justify-start">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign in
                  </Button>
                </SignInButton>
            </SignedOut>
          
        
            <SignedIn>
              <div className="flex items-center gap-5">
                <UserButton 
                  appearance={{
                    elements: {
                      avatarBox: "h-8 w-8",
                      modalContent: "mx-auto"
                    }
                  }}
                />
                {user && (
                  <span className="text-sm font-medium text-muted-foreground">
                    {user.emailAddresses[0].emailAddress}
                  </span>
                )}
              </div>
            </SignedIn>
        </div>
      </div>
    </div>
  );
}