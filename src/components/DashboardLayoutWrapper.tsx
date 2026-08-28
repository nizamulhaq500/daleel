'use client';

import React from 'react';

export default function DashboardLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#060910] text-slate-100 flex flex-col relative">
      {children}
    </div>
  );
}
