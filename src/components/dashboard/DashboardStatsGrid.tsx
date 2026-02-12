'use client';

import { Activity, BarChart3, Zap, Calendar } from 'lucide-react';

export default function DashboardStatsGrid() {
  const stats = [
    { label: 'Volatility', val: 'High', color: 'text-rose-600', bg: 'bg-rose-50', icon: Activity },
    { label: 'Volume', val: '24.5M', color: 'text-slate-900', bg: 'bg-slate-50', icon: BarChart3 },
    { label: 'Risk Level', val: 'Medium', color: 'text-orange-600', bg: 'bg-orange-50', icon: Zap },
    { label: 'Target', val: '10.3K', color: 'text-emerald-600', bg: 'bg-emerald-50', icon: Calendar },
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
             <p className={`text-base font-black ${item.color}`}>{item.val}</p>
           </div>
        </div>
      ))}
    </div>
  );
}
