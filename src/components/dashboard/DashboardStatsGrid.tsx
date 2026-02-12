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
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {stats.map((item, i) => (
        <div key={i} className="bg-white p-4 rounded-2xl border border-slate-100 flex flex-col items-center justify-center text-center hover:shadow-md transition-shadow">
           <div className={`p-2 rounded-full ${item.bg} mb-2`}>
              <item.icon className={`w-4 h-4 ${item.color}`} />
           </div>
           <p className="text-xs text-slate-400 font-medium mb-0.5">{item.label}</p>
           <p className={`text-lg font-bold ${item.color}`}>{item.val}</p>
        </div>
      ))}
    </div>
  );
}
