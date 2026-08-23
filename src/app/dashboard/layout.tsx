'use client';

import Navbar from "@/components/Navbar";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import DashboardLayoutWrapper from "@/components/DashboardLayoutWrapper";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  if (loading) {
    return <div className="min-h-screen bg-slate-950 flex items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return null; // Will redirect
  }

  return (
    <DashboardLayoutWrapper>
      <Navbar />
      <div className="flex-1 bg-slate-950/90 backdrop-blur-sm z-10 flex flex-col relative shadow-2xl shadow-slate-900/50">
        {children}
      </div>
    </DashboardLayoutWrapper>
  );
}
