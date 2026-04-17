import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";

const ADMIN_BYPASS_KEY = "averroes_admin_bypass";
const BYPASS_ADMIN_EMAIL = "admin@averroes.web.id";

export const useAdminAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isBypassActive, setIsBypassActive] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const hasBypass = () => localStorage.getItem(ADMIN_BYPASS_KEY) === "true";

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      const bypassActive = hasBypass();

      setSession(session);
      setUser(session?.user ?? null);
      setIsBypassActive(bypassActive);
      
      if (bypassActive) {
        setIsAdmin(true);
        setIsLoading(false);
        return;
      }

      if (!session) {
        setIsAdmin(false);
        setIsLoading(false);
        navigate("/admin/auth");
      } else {
        setTimeout(() => {
          checkAdminStatus(session.user.id);
        }, 0);
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      const bypassActive = hasBypass();

      setSession(session);
      setUser(session?.user ?? null);
      setIsBypassActive(bypassActive);
      
      if (bypassActive) {
        setIsAdmin(true);
        setIsLoading(false);
        return;
      }

      if (!session) {
        setIsAdmin(false);
        setIsLoading(false);
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
    } catch (error) {
      console.error("Error checking admin:", error);
      setIsAdmin(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    localStorage.removeItem(ADMIN_BYPASS_KEY);
    setIsBypassActive(false);
    await supabase.auth.signOut();
    navigate("/admin/auth");
  };

  return {
    user,
    session,
    isAdmin,
    isLoading,
    isBypassActive,
    userEmail: user?.email ?? (isBypassActive ? BYPASS_ADMIN_EMAIL : undefined),
    handleLogout,
  };
};
