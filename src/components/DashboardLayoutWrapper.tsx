'use client';


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
      <div className="absolute inset-0 pointer-events-none opacity-10 bg-[url('https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center filter grayscale blur-sm">
      </div>
      
      {/* Foreground Layer: The actual Dashboard */}
      <div className="relative z-10 flex flex-col min-h-screen bg-slate-950/80 backdrop-blur-md">
        {children}
      </div>
    </div>
  );
}
