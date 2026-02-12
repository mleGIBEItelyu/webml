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
    <div className="bg-white rounded-[2rem] p-6 sm:p-8 shadow-[0_2px_40px_-12px_rgba(0,0,0,0.08)] border border-slate-100 mb-6 animate-in fade-in duration-700">
      <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-6">
        
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

        {/* Right: AI Conclusion */}
        <div className="lg:max-w-xs w-full lg:w-72">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 relative overflow-hidden group hover:border-red-100 transition-colors">
            <div className="absolute -right-4 -top-4 w-20 h-20 bg-red-500/5 blur-2xl group-hover:bg-red-500/10 transition-colors rounded-full"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1 bg-yellow-400/10 rounded-md">
                  <Zap className="w-3.5 h-3.5 text-yellow-600 fill-yellow-600" />
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">AI Conclusion</span>
              </div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xl font-black text-slate-900 italic">STRONG BUY</h2>
                <span className="text-xs font-bold text-slate-500 bg-white px-2 py-0.5 rounded-lg border border-slate-100 shadow-sm">88% Conf.</span>
              </div>
              <div className="space-y-2">
                <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden flex">
                  <div className="h-full bg-linear-to-r from-red-600 to-red-400 w-[88%] rounded-full"></div>
                </div>
                <p className="text-[11px] leading-relaxed text-slate-500 font-medium">
                  Strong upward momentum predicted for the next <span className="text-red-600 font-bold">7 days</span>.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
