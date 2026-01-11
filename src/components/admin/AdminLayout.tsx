import { ReactNode } from "react";
import AdminSidebar from "./AdminSidebar";

interface AdminLayoutProps {
  children: ReactNode;
  onLogout: () => void;
  userEmail?: string;
}

const AdminLayout = ({ children, onLogout, userEmail }: AdminLayoutProps) => {
  return (
    <div className="min-h-screen flex w-full bg-background">
      <AdminSidebar onLogout={onLogout} userEmail={userEmail} />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
