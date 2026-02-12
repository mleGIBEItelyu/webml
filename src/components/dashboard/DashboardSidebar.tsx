'use client';

import { Zap, ArrowRight } from 'lucide-react';

interface DashboardSidebarProps {
  onRecommendationClick?: () => void;
  onFinancialsClick?: () => void;
}

export default function DashboardSidebar({ onRecommendationClick, onFinancialsClick }: DashboardSidebarProps) {
  return (
    <div className="space-y-6">
       
       {/* Recommendation Card */}
       <div className="bg-slate-900 text-white p-6 rounded-[2rem] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-red-600/30 blur-[50px] -mr-10 -mt-10 rounded-full"></div>
          <div className="relative z-10">
             <p className="text-slate-400 text-sm font-medium mb-4 flex items-center gap-2">
               <Zap className="w-4 h-4 text-yellow-400" />
               AI Conclusion
             </p>
             <h2 className="text-3xl font-bold mb-2">STRONG BUY</h2>
             <p className="text-slate-400 text-sm leading-relaxed mb-6">
               Based on historical patterns and positive sentiment, this stock is predicted to rise within the next 7 days.
             </p>
             
             <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-300">Confidence Score</span>
                  <span className="font-bold">88%</span>
                </div>
                <div className="w-full bg-black/20 h-2 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-red-500 to-orange-500 h-full w-[88%]"></div>
                </div>
             </div>
          </div>
       </div>

       {/* Fundamental Brief */}
       <div className="bg-white p-6 rounded-[2rem] border border-slate-100">
          <h3 className="font-bold text-slate-900 mb-4">Key Statistics</h3>
          <div className="space-y-3">
             <div className="flex justify-between py-2 border-b border-slate-50">
                <span className="text-sm text-slate-500">Market Cap</span>
                <span className="text-sm font-bold">1,200 T</span>
             </div>
             <div className="flex justify-between py-2 border-b border-slate-50">
                <span className="text-sm text-slate-500">P/E Ratio</span>
                <span className="text-sm font-bold">24.5x</span>
             </div>
             <div className="flex justify-between py-2 border-b border-slate-50">
                <span className="text-sm text-slate-500">Dividend Yield</span>
                <span className="text-sm font-bold">2.1%</span>
             </div>
          </div>
       </div>
    </div>
  );
}
