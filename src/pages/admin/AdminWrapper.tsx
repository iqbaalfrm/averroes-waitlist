import { Outlet } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldAlert, LogOut, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import AdminLayout from "@/components/admin/AdminLayout";
import { Skeleton } from "@/components/ui/skeleton";

const AdminWrapper = () => {
  const { user, userEmail, isAdmin, isLoading, handleLogout } = useAdminAuth();

  if (isLoading || isAdmin === null) {
    return (
      <div className="min-h-screen bg-background flex">
        <div className="w-64 border-r border-border p-4 space-y-4">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="flex-1 p-6">
          <Skeleton className="h-8 w-48 mb-4" />
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-24" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isAdmin === false) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="w-16 h-16 rounded-2xl bg-destructive/10 mx-auto mb-4 flex items-center justify-center">
              <ShieldAlert className="w-8 h-8 text-destructive" />
            </div>
            <CardTitle className="text-2xl">Akses Ditolak</CardTitle>
            <p className="text-muted-foreground">
              Akun ({userEmail ?? user?.email}) tidak memiliki akses admin.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={handleLogout} variant="outline" className="w-full">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
            <Link to="/" className="block">
              <Button variant="ghost" className="w-full">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Kembali ke halaman utama
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <AdminLayout onLogout={handleLogout} userEmail={userEmail}>
      <Outlet />
    </AdminLayout>
  );
};

export default AdminWrapper;
