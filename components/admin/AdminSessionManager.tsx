"use client";

import { useEffect, useRef } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter, usePathname } from "next/navigation";
import { useToast } from "@/contexts/ToastContext";

export default function AdminSessionManager() {
  const router = useRouter();
  const pathname = usePathname();
  const { showInfo, showError } = useToast();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // 🔒 1. Session validation on mount
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session && pathname !== "/admin/login") {
        showError("Not logged in", "Please log in to access the admin panel.");
        router.push("/admin/login");
      }
    };
    checkSession();
  }, [pathname, router, showError]);

  // 🔄 2. Cross-tab and auth change detection
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") {
        showInfo("Session ended", "You have been logged out.");
        router.push("/admin/login");
      }
    });

    return () => subscription.unsubscribe();
  }, [router, showInfo]);

  // ⏰ 3. Inactivity logout (30 min)
  useEffect(() => {
    const timeoutMs = 30 * 60 * 1000;

    const resetTimer = () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(async () => {
        await supabase.auth.signOut();
        showInfo("Session expired", "You’ve been logged out due to inactivity.", 0);
        router.push("/admin/login");
      }, timeoutMs);
    };

    const events = ["mousemove", "mousedown", "keypress", "scroll", "touchstart"];
    events.forEach((e) => window.addEventListener(e, resetTimer));
    resetTimer();

    return () => {
      events.forEach((e) => window.removeEventListener(e, resetTimer));
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [router, showInfo]);

  return null;
}