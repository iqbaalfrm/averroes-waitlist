import { ReactNode, useState } from "react";
import AdminSidebar from "./AdminSidebar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { Link } from "react-router-dom";

interface AdminLayoutProps {
  children: ReactNode;
  onLogout: () => void;
  userEmail?: string;
}

const AdminLayout = ({ children, onLogout, userEmail }: AdminLayoutProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col md:flex-row w-full bg-background">
      {/* Mobile Header */}
      <header className="md:hidden flex items-center justify-between p-4 border-b border-border bg-card sticky top-0 z-40">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-hero flex items-center justify-center text-primary-foreground font-bold text-sm">
            A
          </div>
          <span className="font-bold text-foreground">Averroes Admin</span>
        </Link>

        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="shrink-0">
              <Menu className="w-5 h-5" />
              <span className="sr-only">Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-72">
            <AdminSidebar
              onLogout={() => {
                setMobileMenuOpen(false);
                onLogout();
              }}
              userEmail={userEmail}
              isMobile={true}
            />
          </SheetContent>
        </Sheet>
      </header>

      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <AdminSidebar onLogout={onLogout} userEmail={userEmail} />
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
