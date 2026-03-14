'use client';

import { Activity, BarChart3, Zap, Calendar } from 'lucide-react';
import type { StockSignal } from '@/lib/types/signal';

interface DashboardStatsGridProps {
  signal?: StockSignal | null;
  isLoading?: boolean;
}

function Skeleton() {
  return <div className="h-4 w-16 bg-slate-100 animate-pulse rounded" />;
}

export default function DashboardStatsGrid({ signal, isLoading }: DashboardStatsGridProps) {
  // Logic untuk menurunkan nilai metrik dari signal
  const getVolatility = (s: StockSignal | null | undefined) => {
    if (!s) return 'Low';
    const range = (s.range_max_pct ?? 0) - (s.range_min_pct ?? 0);
    if (range > 15) return 'Very High';
    if (range > 10) return 'High';
    if (range > 5) return 'Medium';
    return 'Low';
  };

  const getRiskLevel = (s: StockSignal | null | undefined) => {
    if (!s) return 'Medium';
    const confidence = s.confidence ?? 0;
    if (confidence < 60) return 'High';
    if (confidence < 85) return 'Medium';
    return 'Low';
  };

  const formatVolume = (vol?: number) => {
    if (!vol) return '24.5M'; // Fallback sample
    if (vol >= 1000000) return `${(vol / 1000000).toFixed(1)}M`;
    if (vol >= 1000) return `${(vol / 1000).toFixed(1)}K`;
    return vol.toString();
  };

  const formatRupiahK = (val: number) => {
    return `${(val / 1000).toFixed(1)}K`;
  };

  const stats = [
    { 
      label: 'Volatility', 
      val: isLoading ? <Skeleton /> : getVolatility(signal ?? null), 
      color: 'text-rose-600', 
      bg: 'bg-rose-50', 
      icon: Activity 
    },
    { 
      label: 'Volume', 
      val: isLoading ? <Skeleton /> : formatVolume(signal?.volume), 
      color: 'text-slate-900', 
      bg: 'bg-slate-50', 
      icon: BarChart3 
    },
    { 
      label: 'Risk Level', 
      val: isLoading ? <Skeleton /> : getRiskLevel(signal ?? null), 
      color: 'text-orange-600', 
      bg: 'bg-orange-50', 
      icon: Zap 
    },
    { 
      label: 'Target', 
      val: isLoading ? <Skeleton /> : (signal ? formatRupiahK(signal.pred_7d_close) : '—'), 
      color: 'text-emerald-600', 
      bg: 'bg-emerald-50', 
      icon: Calendar 
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4">
      {stats.map((item, i) => (
        <div key={i} className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center gap-4 hover:shadow-md transition-shadow group">
           <div className={`p-2.5 rounded-xl ${item.bg} group-hover:scale-110 transition-transform`}>
              <item.icon className={`w-5 h-5 ${item.color}`} />
           </div>
           <div className="text-left">
             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">{item.label}</p>
             <div className={`text-base font-black ${item.color}`}>{item.val}</div>
           </div>
        </div>
      ))}
    </div>
  );
}
