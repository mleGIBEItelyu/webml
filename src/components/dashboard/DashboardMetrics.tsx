'use client';

import { TrendingUp, Zap, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';

interface DashboardMetricsProps {
  query: string;
}

export default function DashboardMetrics({ query }: DashboardMetricsProps) {
  const [lastUpdated, setLastUpdated] = useState<string>('');
  
  // Mock data for display - in a real app this would come from props or API
  const price = "Rp 9,850";
  const change = "+1.2% (Daily)";

  useEffect(() => {
    const now = new Date();
    const formatted = now.toLocaleString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: 'Asia/Jakarta'
    });
    setLastUpdated(formatted);
  }, []);
  
  return (
    <div className="bg-white rounded-[2rem] p-6 sm:p-8 shadow-[0_2px_40px_-12px_rgba(0,0,0,0.08)] border border-slate-100 mb-6 animate-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col lg:flex-row justify-between lg:items-end gap-6">
        
        {/* Left: Identity & Price */}
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="bg-slate-900 text-white px-3 py-1 rounded-lg text-sm font-bold">{query || 'BBCA'}</span>
            <span className="text-slate-500 text-sm font-medium">Bank Central Asia Tbk</span>
          </div>
          <div className="flex items-baseline gap-4 mt-1">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900">{price}</h1>
            <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full font-bold text-sm">
              <TrendingUp className="w-4 h-4" />
              <span>{change}</span>
            </div>
          </div>
          <p className="text-slate-400 text-sm mt-2">Last updated: {lastUpdated ? `${lastUpdated} WIB` : 'Loading...'}</p>
        </div>

      </div>
    </div>
  );
}
