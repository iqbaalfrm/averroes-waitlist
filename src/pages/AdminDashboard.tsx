import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Lock, Users, Mail, TrendingUp, Calendar, Download, ArrowLeft, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";

// Simple password protection - change this to your desired password
const ADMIN_PASSWORD = "averroes2024";

interface WaitlistEntry {
  id: string;
  email: string;
  name: string | null;
  interests: string[] | null;
  created_at: string;
}

const AdminDashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [waitlistData, setWaitlistData] = useState<WaitlistEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      sessionStorage.setItem("admin_auth", "true");
      toast({
        title: "Login berhasil",
        description: "Selamat datang di Admin Dashboard",
      });
    } else {
      toast({
        title: "Password salah",
        description: "Silakan coba lagi",
        variant: "destructive",
      });
    }
  };

  const fetchWaitlistData = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("waitlist")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setWaitlistData(data || []);
    } catch (error) {
      console.error("Error fetching waitlist:", error);
      toast({
        title: "Error",
        description: "Gagal memuat data waitlist",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const authStatus = sessionStorage.getItem("admin_auth");
    if (authStatus === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchWaitlistData();
    }
  }, [isAuthenticated]);

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("admin_auth");
    setPassword("");
  };

  const exportToCSV = () => {
    if (waitlistData.length === 0) return;

    const headers = ["Email", "Nama", "Minat", "Tanggal Daftar"];
    const rows = waitlistData.map((entry) => [
      entry.email,
      entry.name || "-",
      entry.interests?.join(", ") || "-",
      new Date(entry.created_at).toLocaleString("id-ID"),
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `waitlist_averroes_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();

    toast({
      title: "Export berhasil",
      description: "File CSV telah diunduh",
    });
  };

  // Calculate stats
  const totalSignups = waitlistData.length;
  const todaySignups = waitlistData.filter((entry) => {
    const today = new Date().toDateString();
    return new Date(entry.created_at).toDateString() === today;
  }).length;
  const weekSignups = waitlistData.filter((entry) => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return new Date(entry.created_at) >= weekAgo;
  }).length;

  // Interest breakdown
  const interestCounts: Record<string, number> = {};
  waitlistData.forEach((entry) => {
    entry.interests?.forEach((interest) => {
      interestCounts[interest] = (interestCounts[interest] || 0) + 1;
    });
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background islamic-pattern flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-card">
          <CardHeader className="text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-hero mx-auto mb-4 flex items-center justify-center">
              <Lock className="w-8 h-8 text-primary-foreground" />
            </div>
            <CardTitle className="text-2xl">Admin Dashboard</CardTitle>
            <p className="text-muted-foreground">Masukkan password untuk mengakses</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 rounded-xl"
              />
              <Button type="submit" className="w-full" size="lg">
                Masuk
              </Button>
            </form>
            <div className="mt-6 text-center">
              <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                ← Kembali ke halaman utama
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Kembali</span>
            </Link>
            <div className="h-6 w-px bg-border" />
            <h1 className="font-bold text-lg">Admin Dashboard</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={fetchWaitlistData} disabled={isLoading}>
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="shadow-soft">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-hero flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Pendaftar</p>
                  <p className="text-2xl font-bold text-foreground">{totalSignups}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-gold flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-accent-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Hari Ini</p>
                  <p className="text-2xl font-bold text-foreground">{todaySignups}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-mint flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">7 Hari Terakhir</p>
                  <p className="text-2xl font-bold text-foreground">{weekSignups}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
                  <Mail className="w-6 h-6 text-secondary-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Rata-rata/Hari</p>
                  <p className="text-2xl font-bold text-foreground">
                    {totalSignups > 0 ? Math.round(weekSignups / 7) : 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Interest Breakdown */}
        {Object.keys(interestCounts).length > 0 && (
          <Card className="shadow-soft mb-8">
            <CardHeader>
              <CardTitle className="text-lg">Minat Pendaftar</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                {Object.entries(interestCounts)
                  .sort((a, b) => b[1] - a[1])
                  .map(([interest, count]) => (
                    <Badge key={interest} variant="secondary" className="px-4 py-2 text-sm">
                      {interest}: <span className="font-bold ml-1">{count}</span>
                    </Badge>
                  ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Waitlist Table */}
        <Card className="shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Daftar Pendaftar</CardTitle>
            <Button variant="outline" size="sm" onClick={exportToCSV} disabled={waitlistData.length === 0}>
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <RefreshCw className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : waitlistData.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Mail className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Belum ada pendaftar</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">#</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Nama</TableHead>
                      <TableHead>Minat</TableHead>
                      <TableHead>Tanggal Daftar</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {waitlistData.map((entry, index) => (
                      <TableRow key={entry.id}>
                        <TableCell className="font-medium text-muted-foreground">
                          {index + 1}
                        </TableCell>
                        <TableCell className="font-medium">{entry.email}</TableCell>
                        <TableCell>{entry.name || <span className="text-muted-foreground">-</span>}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {entry.interests?.map((interest) => (
                              <Badge key={interest} variant="outline" className="text-xs">
                                {interest}
                              </Badge>
                            )) || <span className="text-muted-foreground">-</span>}
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {new Date(entry.created_at).toLocaleString("id-ID", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AdminDashboard;
