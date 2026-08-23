'use client';

import LandingPage from "@/app/page";
import { useAuth } from "@/contexts/AuthContext";

// We wrap the children to inject the Landing Page as the background
export default function DashboardLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();

  return (
    <div className="relative min-h-screen bg-slate-950">
      {/* Background Layer: Always show the Landing Page content */}
      <div className="absolute inset-0 pointer-events-none opacity-20 filter grayscale blur-[2px]">
        <LandingPage isBackground={true} />
      </div>
      
      {/* Foreground Layer: The actual Dashboard */}
      <div className="relative z-10 flex flex-col min-h-screen bg-slate-950/80 backdrop-blur-md">
        {children}
      </div>
    </div>
  );
}
