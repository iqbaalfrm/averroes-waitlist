import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Users,
  Mail,
  FileText,
  LayoutDashboard,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Sun,
  Moon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";

interface AdminSidebarProps {
  onLogout: () => void;
  userEmail?: string;
  className?: string;
  isMobile?: boolean; // New prop to handle mobile styling vs desktop sticky sidebar
}

export const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    path: "/admin",
  },
  {
    title: "Pendaftar",
    icon: Users,
    path: "/admin/waitlist",
  },
  {
    title: "Template Email",
    icon: FileText,
    path: "/admin/templates",
  },
  {
    title: "Kirim Email",
    icon: Mail,
    path: "/admin/send-email",
  },
];

const AdminSidebar = ({ onLogout, userEmail, className, isMobile = false }: AdminSidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { theme, setTheme } = useTheme();

  // If mobile, never collapsed (controlled by sheet closing)
  const isCollapsed = isMobile ? false : collapsed;

  const isActive = (path: string) => {
    if (path === "/admin") {
      return location.pathname === "/admin";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <aside
      className={cn(
        "bg-card border-r border-border flex flex-col transition-all duration-300",
        // Desktop styles: sticky and scalable width
        !isMobile && "h-screen sticky top-0",
        !isMobile && (isCollapsed ? "w-16" : "w-64"),
        // Mobile styles: full height
        isMobile && "h-full w-full border-none",
        className
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-hero flex items-center justify-center text-primary-foreground font-bold text-sm">
            A
          </div>
          {!isCollapsed && <span className="font-bold text-foreground">Averroes</span>}
        </Link>
      </div>

      {/* Collapse Button (Desktop Only) */}
      {!isMobile && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-16 w-6 h-6 rounded-full border border-border bg-card p-0 shadow-sm z-10"
        >
          {isCollapsed ? (
            <ChevronRight className="w-3 h-3" />
          ) : (
            <ChevronLeft className="w-3 h-3" />
          )}
        </Button>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
              isActive(item.path)
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <item.icon className="w-5 h-5 shrink-0" />
            {!isCollapsed && <span className="text-sm font-medium">{item.title}</span>}
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-border space-y-2 mt-auto">
        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className={cn(
            "w-full justify-start gap-3",
            isCollapsed && "justify-center px-0"
          )}
        >
          {theme === "dark" ? (
            <Sun className="w-5 h-5 shrink-0" />
          ) : (
            <Moon className="w-5 h-5 shrink-0" />
          )}
          {!isCollapsed && (
            <span className="text-sm">
              {theme === "dark" ? "Mode Terang" : "Mode Gelap"}
            </span>
          )}
        </Button>

        {/* User Info */}
        {!isCollapsed && userEmail && (
          <div className="px-3 py-2 text-xs text-muted-foreground truncate border-t border-border/50 pt-2">
            {userEmail}
          </div>
        )}

        {/* Logout */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onLogout}
          className={cn(
            "w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10",
            isCollapsed && "justify-center px-0"
          )}
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {!isCollapsed && <span className="text-sm">Logout</span>}
        </Button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
