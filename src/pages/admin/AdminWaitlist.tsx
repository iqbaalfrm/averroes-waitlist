import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Users, Mail, TrendingUp, Calendar, Download, Bell, Search, Filter, X, Trash2, ChevronLeft, ChevronRight, BarChart3 } from "lucide-react";
import ReminderEmailDialog, { EmailTemplate } from "@/components/ReminderEmailDialog";
import NotificationEmailDialog, { NotificationTemplate } from "@/components/NotificationEmailDialog";
import { TableSkeleton } from "@/components/DashboardSkeleton";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface WaitlistEntry {
  id: string;
  email: string;
  name: string | null;
  interests: string[] | null;
  created_at: string;
  last_reminder_at: string | null;
  reminder_count: number | null;
}

const ITEMS_PER_PAGE = 10;

const TEST_WAITLIST_ENTRY: WaitlistEntry = {
  id: "11111111-2222-4333-8444-555555555555",
  email: "fileamansentosa@gmail.com",
  name: "File Aman Sentosa",
  interests: ["Saham Syariah", "Crypto Syariah", "Zakat"],
  created_at: new Date().toISOString(),
  last_reminder_at: null,
  reminder_count: 0,
};

const AdminWaitlist = () => {
  const [waitlistData, setWaitlistData] = useState<WaitlistEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSendingReminder, setIsSendingReminder] = useState(false);
  const [showReminderDialog, setShowReminderDialog] = useState(false);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [interestFilter, setInterestFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("all");
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  
  // Delete states
  const [deleteEntry, setDeleteEntry] = useState<WaitlistEntry | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Bulk selection states
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showBulkDeleteDialog, setShowBulkDeleteDialog] = useState(false);
  
  // Notification email states
  const [showNotificationDialog, setShowNotificationDialog] = useState(false);
  const [isSendingNotification, setIsSendingNotification] = useState(false);
  const [notificationPreselected, setNotificationPreselected] = useState<string[]>([]);
  
  const { toast } = useToast();

  useEffect(() => {
    fetchWaitlistData();
  }, []);

  const fetchWaitlistData = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("waitlist")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setWaitlistData(data?.length ? data : [TEST_WAITLIST_ENTRY]);
    } catch (error) {
      console.error("Error fetching waitlist:", error);
      setWaitlistData([TEST_WAITLIST_ENTRY]);
      toast({
        title: "Error",
        description: "Gagal memuat data waitlist, data tes lokal ditampilkan.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
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

  // Calculate eligible users for reminder
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

  const sendNotifications = async (template: NotificationTemplate, recipientIds: string[]) => {
    setIsSendingNotification(true);
    try {
      const { data, error } = await supabase.functions.invoke("send-notification-email", {
        body: { template, recipientIds },
      });

      if (error) throw error;

      toast({
        title: "Notifikasi terkirim",
        description: `Berhasil mengirim ${data.sent} email notifikasi`,
      });
      
      setShowNotificationDialog(false);
      setNotificationPreselected([]);
    } catch (error: any) {
      console.error("Error sending notifications:", error);
      toast({
        title: "Gagal mengirim notifikasi",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSendingNotification(false);
    }
  };

  const openNotificationForSelected = () => {
    setNotificationPreselected(Array.from(selectedIds));
    setShowNotificationDialog(true);
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

  // Daily signups chart data
  const chartData = useMemo(() => {
    const days: { date: string; count: number; label: string }[] = [];
    for (let i = 13; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];
      const label = date.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
      const count = waitlistData.filter(
        (entry) => new Date(entry.created_at).toISOString().split("T")[0] === dateStr
      ).length;
      days.push({ date: dateStr, count, label });
    }
    return days;
  }, [waitlistData]);

  // Interest breakdown
  const interestCounts: Record<string, number> = {};
  waitlistData.forEach((entry) => {
    entry.interests?.forEach((interest) => {
      interestCounts[interest] = (interestCounts[interest] || 0) + 1;
    });
  });

  // Get unique interests for filter
  const uniqueInterests = useMemo(() => {
    const interests = new Set<string>();
    waitlistData.forEach((entry) => {
      entry.interests?.forEach((interest) => interests.add(interest));
    });
    return Array.from(interests).sort();
  }, [waitlistData]);

  // Filtered data
  const filteredData = useMemo(() => {
    return waitlistData.filter((entry) => {
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = !searchQuery || 
        entry.email.toLowerCase().includes(searchLower) ||
        (entry.name?.toLowerCase().includes(searchLower) ?? false);

      const matchesInterest = interestFilter === "all" || 
        (entry.interests?.includes(interestFilter) ?? false);

      let matchesDate = true;
      if (dateFilter !== "all") {
        const entryDate = new Date(entry.created_at);
        const now = new Date();
        
        switch (dateFilter) {
          case "today":
            matchesDate = entryDate.toDateString() === now.toDateString();
            break;
          case "week":
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            matchesDate = entryDate >= weekAgo;
            break;
          case "month":
            const monthAgo = new Date();
            monthAgo.setMonth(monthAgo.getMonth() - 1);
            matchesDate = entryDate >= monthAgo;
            break;
        }
      }

      return matchesSearch && matchesInterest && matchesDate;
    });
  }, [waitlistData, searchQuery, interestFilter, dateFilter]);

  const hasActiveFilters = searchQuery || interestFilter !== "all" || dateFilter !== "all";

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, interestFilter, dateFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredData.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredData, currentPage]);

  // Delete handlers
  const handleDelete = async () => {
    if (!deleteEntry) return;
    
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from("waitlist")
        .delete()
        .eq("id", deleteEntry.id);

      if (error) throw error;

      toast({
        title: "Berhasil dihapus",
        description: `${deleteEntry.email} telah dihapus dari waitlist`,
      });
      
      setDeleteEntry(null);
      fetchWaitlistData();
    } catch (error: any) {
      console.error("Error deleting entry:", error);
      toast({
        title: "Gagal menghapus",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    
    setIsDeleting(true);
    try {
      const idsArray = Array.from(selectedIds);
      const { error } = await supabase
        .from("waitlist")
        .delete()
        .in("id", idsArray);

      if (error) throw error;

      toast({
        title: "Berhasil dihapus",
        description: `${idsArray.length} pendaftar telah dihapus dari waitlist`,
      });
      
      setSelectedIds(new Set());
      setShowBulkDeleteDialog(false);
      fetchWaitlistData();
    } catch (error: any) {
      console.error("Error bulk deleting:", error);
      toast({
        title: "Gagal menghapus",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  // Selection handlers
  const toggleSelectAll = () => {
    if (selectedIds.size === paginatedData.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(paginatedData.map((e) => e.id)));
    }
  };

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setInterestFilter("all");
    setDateFilter("all");
    setCurrentPage(1);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Daftar Pendaftar</h1>
          <p className="text-muted-foreground">Kelola pendaftar waitlist Averroes</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => {
              setNotificationPreselected([]);
              setShowNotificationDialog(true);
            }}
            disabled={waitlistData.length === 0}
          >
            <Mail className="w-4 h-4 mr-2" />
            Kirim Notifikasi
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowReminderDialog(true)} 
            disabled={eligibleForReminder === 0}
          >
            <Bell className="w-4 h-4 mr-2" />
            Reminder ({eligibleForReminder})
          </Button>
          <Button variant="outline" size="sm" onClick={exportToCSV} disabled={waitlistData.length === 0}>
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="shadow-soft">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-hero flex items-center justify-center">
                <Users className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total</p>
                <p className="text-xl font-bold text-foreground">{totalSignups}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-gold flex items-center justify-center">
                <Calendar className="w-5 h-5 text-accent-foreground" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Hari Ini</p>
                <p className="text-xl font-bold text-foreground">{todaySignups}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-mint flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">7 Hari</p>
                <p className="text-xl font-bold text-foreground">{weekSignups}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                <Mail className="w-5 h-5 text-secondary-foreground" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Rata-rata/Hari</p>
                <p className="text-xl font-bold text-foreground">
                  {totalSignups > 0 ? Math.round(weekSignups / 7) : 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <Card className="shadow-soft mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Pendaftar per Hari (14 Hari Terakhir)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis 
                  dataKey="label" 
                  tick={{ fontSize: 11 }} 
                  tickLine={false}
                  axisLine={false}
                  className="text-muted-foreground"
                />
                <YAxis 
                  tick={{ fontSize: 11 }} 
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                  className="text-muted-foreground"
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "hsl(var(--card))", 
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px"
                  }}
                  labelStyle={{ color: "hsl(var(--foreground))" }}
                  formatter={(value: number) => [value, "Pendaftar"]}
                />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  fill="url(#colorCount)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Interest Breakdown */}
      {Object.keys(interestCounts).length > 0 && (
        <Card className="shadow-soft mb-6">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Minat Pendaftar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {Object.entries(interestCounts)
                .sort((a, b) => b[1] - a[1])
                .map(([interest, count]) => (
                  <Badge key={interest} variant="secondary" className="px-3 py-1 text-xs">
                    {interest}: <span className="font-bold ml-1">{count}</span>
                  </Badge>
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Table */}
      <Card className="shadow-soft">
        <CardContent className="p-4">
          {/* Filter Controls */}
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Cari email atau nama..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={interestFilter} onValueChange={setInterestFilter}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Minat" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Minat</SelectItem>
                {uniqueInterests.map((interest) => (
                  <SelectItem key={interest} value={interest}>
                    {interest}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <Calendar className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Tanggal" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Waktu</SelectItem>
                <SelectItem value="today">Hari Ini</SelectItem>
                <SelectItem value="week">7 Hari Terakhir</SelectItem>
                <SelectItem value="month">30 Hari Terakhir</SelectItem>
              </SelectContent>
            </Select>
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-1">
                <X className="w-4 h-4" />
                Reset
              </Button>
            )}
          </div>

          {/* Bulk actions */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              {hasActiveFilters && (
                <p className="text-xs text-muted-foreground">
                  {filteredData.length} dari {waitlistData.length}
                </p>
              )}
              {selectedIds.size > 0 && (
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary" className="text-xs">{selectedIds.size} dipilih</Badge>
                  <Button variant="outline" size="sm" onClick={openNotificationForSelected}>
                    <Mail className="w-4 h-4 mr-1" />
                    Email
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => setShowBulkDeleteDialog(true)}>
                    <Trash2 className="w-4 h-4 mr-1" />
                    Hapus
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedIds(new Set())}>
                    Batal
                  </Button>
                </div>
              )}
            </div>
          </div>

          {isLoading ? (
            <TableSkeleton />
          ) : waitlistData.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Mail className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Belum ada pendaftar</p>
            </div>
          ) : filteredData.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Tidak ada hasil yang cocok</p>
              <Button variant="link" onClick={clearFilters} className="mt-2">
                Reset filter
              </Button>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[40px]">
                        <Checkbox
                          checked={paginatedData.length > 0 && selectedIds.size === paginatedData.length}
                          onCheckedChange={toggleSelectAll}
                        />
                      </TableHead>
                      <TableHead className="w-[40px]">#</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Nama</TableHead>
                      <TableHead>Minat</TableHead>
                      <TableHead>Tanggal</TableHead>
                      <TableHead className="w-[60px]">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedData.map((entry, index) => (
                      <TableRow key={entry.id} className={selectedIds.has(entry.id) ? "bg-muted/50" : ""}>
                        <TableCell>
                          <Checkbox
                            checked={selectedIds.has(entry.id)}
                            onCheckedChange={() => toggleSelect(entry.id)}
                          />
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                        </TableCell>
                        <TableCell className="font-medium text-sm">{entry.email}</TableCell>
                        <TableCell className="text-sm">{entry.name || <span className="text-muted-foreground">-</span>}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {entry.interests?.slice(0, 2).map((interest) => (
                              <Badge key={interest} variant="outline" className="text-xs">
                                {interest}
                              </Badge>
                            )) || <span className="text-muted-foreground text-xs">-</span>}
                            {(entry.interests?.length || 0) > 2 && (
                              <Badge variant="outline" className="text-xs">+{(entry.interests?.length || 0) - 2}</Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {new Date(entry.created_at).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                          })}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeleteEntry(entry)}
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                  <p className="text-xs text-muted-foreground">
                    Hal. {currentPage}/{totalPages}
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteEntry} onOpenChange={(open) => !open && setDeleteEntry(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Pendaftar?</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah kamu yakin ingin menghapus <strong>{deleteEntry?.email}</strong> dari waitlist?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Menghapus..." : "Hapus"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bulk Delete Dialog */}
      <AlertDialog open={showBulkDeleteDialog} onOpenChange={setShowBulkDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus {selectedIds.size} Pendaftar?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBulkDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Menghapus..." : `Hapus ${selectedIds.size}`}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reminder Email Dialog */}
      <ReminderEmailDialog
        open={showReminderDialog}
        onOpenChange={setShowReminderDialog}
        onSend={sendReminders}
        isSending={isSendingReminder}
        eligibleCount={eligibleForReminder}
      />

      {/* Notification Email Dialog */}
      <NotificationEmailDialog
        open={showNotificationDialog}
        onOpenChange={setShowNotificationDialog}
        onSend={sendNotifications}
        isSending={isSendingNotification}
        allRecipients={waitlistData.map(e => ({ id: e.id, email: e.email, name: e.name }))}
        preSelectedRecipients={notificationPreselected}
      />
    </div>
  );
};

export default AdminWaitlist;
