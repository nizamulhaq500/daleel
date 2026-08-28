'use client';

import Navbar from "@/components/Navbar";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import DashboardLayoutWrapper from "@/components/DashboardLayoutWrapper";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, role, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/');
      } else if (role && pathname && !pathname.startsWith(`/dashboard/${role}`)) {
        // Enforce strict role-based access control (RBAC)
        router.push(`/dashboard/${role}`);
      }
    }
  }, [user, role, loading, pathname, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#060910] flex items-center justify-center text-slate-400 text-xs font-mono">
        Authenticating Secure Session...
      </div>
    );
  }

  if (!user || (role && !pathname?.startsWith(`/dashboard/${role}`))) {
    return null; // Will redirect
  }

  return (
    <DashboardLayoutWrapper>
      <Navbar />
      <main className="flex-1 bg-[#090d16] flex flex-col relative z-0">
        {children}
      </main>
    </DashboardLayoutWrapper>
  );
}
