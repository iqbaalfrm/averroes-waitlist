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
}

const menuItems = [
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

const AdminSidebar = ({ onLogout, userEmail }: AdminSidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { theme, setTheme } = useTheme();

  const isActive = (path: string) => {
    if (path === "/admin") {
      return location.pathname === "/admin";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <aside
      className={cn(
        "h-screen bg-card border-r border-border flex flex-col transition-all duration-300 sticky top-0",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        {!collapsed && (
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-hero flex items-center justify-center text-primary-foreground font-bold text-sm">
              A
            </div>
            <span className="font-bold text-foreground">Averroes</span>
          </Link>
        )}
        {collapsed && (
          <Link to="/" className="mx-auto">
            <div className="w-8 h-8 rounded-lg bg-gradient-hero flex items-center justify-center text-primary-foreground font-bold text-sm">
              A
            </div>
          </Link>
        )}
      </div>

      {/* Collapse Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-16 w-6 h-6 rounded-full border border-border bg-card p-0 shadow-sm"
      >
        {collapsed ? (
          <ChevronRight className="w-3 h-3" />
        ) : (
          <ChevronLeft className="w-3 h-3" />
        )}
      </Button>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1">
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
            {!collapsed && <span className="text-sm font-medium">{item.title}</span>}
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-border space-y-2">
        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className={cn(
            "w-full justify-start gap-3",
            collapsed && "justify-center px-0"
          )}
        >
          {theme === "dark" ? (
            <Sun className="w-5 h-5 shrink-0" />
          ) : (
            <Moon className="w-5 h-5 shrink-0" />
          )}
          {!collapsed && (
            <span className="text-sm">
              {theme === "dark" ? "Mode Terang" : "Mode Gelap"}
            </span>
          )}
        </Button>

        {/* User Info */}
        {!collapsed && userEmail && (
          <div className="px-3 py-2 text-xs text-muted-foreground truncate">
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
            collapsed && "justify-center px-0"
          )}
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {!collapsed && <span className="text-sm">Logout</span>}
        </Button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
