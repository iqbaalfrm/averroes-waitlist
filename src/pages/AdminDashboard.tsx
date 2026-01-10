import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Users, Mail, TrendingUp, Calendar, Download, ArrowLeft, RefreshCw, ShieldAlert, LogOut, Bell } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { User, Session } from "@supabase/supabase-js";
import ReminderEmailDialog, { EmailTemplate } from "@/components/ReminderEmailDialog";
import { DashboardSkeleton, TableSkeleton } from "@/components/DashboardSkeleton";

interface WaitlistEntry {
  id: string;
  email: string;
  name: string | null;
  interests: string[] | null;
  created_at: string;
  last_reminder_at: string | null;
  reminder_count: number | null;
}

const AdminDashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [waitlistData, setWaitlistData] = useState<WaitlistEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSendingReminder, setIsSendingReminder] = useState(false);
  const [showReminderDialog, setShowReminderDialog] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Check authentication and admin status
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (!session) {
        navigate("/admin/auth");
      } else {
        // Check admin status after auth change
        setTimeout(() => {
          checkAdminStatus(session.user.id);
        }, 0);
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (!session) {
        navigate("/admin/auth");
      } else {
        checkAdminStatus(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const checkAdminStatus = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("admin_users")
        .select("id")
        .eq("user_id", userId)
        .maybeSingle();

      if (error && error.code !== "PGRST116") {
        console.error("Error checking admin status:", error);
      }

      setIsAdmin(!!data);
      
      if (data) {
        fetchWaitlistData();
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error checking admin:", error);
      setIsAdmin(false);
      setIsLoading(false);
    }
  };

  const fetchWaitlistData = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("waitlist")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        if (error.code === "PGRST301" || error.message.includes("permission")) {
          setIsAdmin(false);
        } else {
          throw error;
        }
      } else {
        setWaitlistData(data || []);
      }
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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin/auth");
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

  // Calculate eligible users for reminder (7+ days old, less than 3 reminders)
  const eligibleForReminder = waitlistData.filter((entry) => {
    const daysSinceSignup = Math.floor((Date.now() - new Date(entry.created_at).getTime()) / (1000 * 60 * 60 * 24));
    const reminderCount = entry.reminder_count || 0;
    const lastReminder = entry.last_reminder_at ? new Date(entry.last_reminder_at) : null;
    const daysSinceLastReminder = lastReminder 
      ? Math.floor((Date.now() - lastReminder.getTime()) / (1000 * 60 * 60 * 24))
      : Infinity;
    
    return daysSinceSignup >= 7 && reminderCount < 3 && daysSinceLastReminder >= 7;
  }).length;

  const sendReminders = async (template: EmailTemplate) => {
    setIsSendingReminder(true);
    try {
      const { data, error } = await supabase.functions.invoke("send-waitlist-reminder", {
        body: { daysOld: 7, maxReminders: 3, template },
      });

      if (error) throw error;

      toast({
        title: "Reminder terkirim",
        description: `Berhasil mengirim ${data.sent} email reminder`,
      });
      
      setShowReminderDialog(false);
      fetchWaitlistData();
    } catch (error: any) {
      console.error("Error sending reminders:", error);
      toast({
        title: "Gagal mengirim reminder",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSendingReminder(false);
    }
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

  // Initial loading state with full skeleton
  if (isAdmin === null) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header Skeleton */}
        <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-4 w-20 bg-muted rounded animate-pulse" />
              <div className="h-6 w-px bg-border" />
              <div className="h-5 w-32 bg-muted rounded animate-pulse" />
            </div>
            <div className="flex items-center gap-2">
              <div className="h-9 w-24 bg-muted rounded animate-pulse" />
              <div className="h-9 w-20 bg-muted rounded animate-pulse" />
            </div>
          </div>
        </header>
        <main className="container mx-auto px-4 py-8">
          <DashboardSkeleton />
        </main>
      </div>
    );
  }

  // Not admin state
  if (isAdmin === false) {
    return (
      <div className="min-h-screen bg-background islamic-pattern flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-card text-center">
          <CardHeader>
            <div className="w-16 h-16 rounded-2xl bg-destructive/10 mx-auto mb-4 flex items-center justify-center">
              <ShieldAlert className="w-8 h-8 text-destructive" />
            </div>
            <CardTitle className="text-2xl">Akses Ditolak</CardTitle>
            <p className="text-muted-foreground">
              Akun kamu ({user?.email}) tidak memiliki akses admin. Hubungi administrator untuk mendapatkan akses.
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
            <span className="text-sm text-muted-foreground hidden sm:inline">
              {user?.email}
            </span>
            <Button variant="outline" size="sm" onClick={fetchWaitlistData} disabled={isLoading}>
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
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
          <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-2">
            <CardTitle className="text-lg">Daftar Pendaftar</CardTitle>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowReminderDialog(true)} 
                disabled={eligibleForReminder === 0}
              >
                <Bell className="w-4 h-4 mr-2" />
                Kirim Reminder ({eligibleForReminder})
              </Button>
              <Button variant="outline" size="sm" onClick={exportToCSV} disabled={waitlistData.length === 0}>
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <TableSkeleton />
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
                      <TableHead>Reminder</TableHead>
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
                        <TableCell>
                          {entry.reminder_count ? (
                            <Badge variant="secondary" className="text-xs">
                              {entry.reminder_count}x
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground text-xs">-</span>
                          )}
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

      {/* Reminder Email Dialog */}
      <ReminderEmailDialog
        open={showReminderDialog}
        onOpenChange={setShowReminderDialog}
        onSend={sendReminders}
        isSending={isSendingReminder}
        eligibleCount={eligibleForReminder}
      />
    </div>
  );
};

export default AdminDashboard;
