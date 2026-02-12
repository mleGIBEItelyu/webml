'use client';

import { useState } from 'react';
import { useToast } from '@/components/providers/ToastProvider';
import DashboardNavbar from '@/components/dashboard/DashboardNavbar';
import DashboardMetrics from '@/components/dashboard/DashboardMetrics';
import SearchModal from '@/components/dashboard/SearchModal';
import PriceForecastChart from '@/components/dashboard/PriceForecastChart';
import DashboardStatsGrid from '@/components/dashboard/DashboardStatsGrid';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';

interface DashboardClientProps {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export default function DashboardClient({ user }: DashboardClientProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [query, setQuery] = useState('BBCA');
  const { showToast, hideToast } = useToast();

  const handleSearch = (newQuery: string) => {
    if (newQuery) {
      const toastId = showToast(`Analyzing ${newQuery.toUpperCase()}...`, 'loading');
      setQuery(newQuery);
      setIsSearchOpen(false);
      
      setTimeout(() => {
        hideToast(toastId);
        showToast(`Analysis complete for ${newQuery.toUpperCase()}`, 'success');
      }, 600);
    }
  };

  const resetSearch = () => {
    setQuery('BBCA');
    setIsSearchOpen(true);
  };

  // Safe user name handling
  const userName = user?.name || 'Admin';

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-slate-900 animate-in fade-in duration-500 relative overflow-x-hidden">
      
      {/* Search Modal Overlay */}
      <SearchModal 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
        onSearch={handleSearch} 
      />

      {/* Main Content - Blurred when search is open */}
      <div className={`transition-all duration-500 ${isSearchOpen ? 'blur-sm grayscale-[0.5] pointer-events-none' : ''}`}>
        
        <DashboardNavbar 
          query={query} 
          onSearchClick={() => setIsSearchOpen(true)}
          onResetSearch={resetSearch}
          userName={userName}
        />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          
          <DashboardMetrics query={query} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Main Chart Section (2/3) */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Chart Card */}
              <div className="bg-white p-6 sm:p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                 <div className="flex justify-between items-center mb-6">
                   <h3 className="font-bold text-slate-800 text-lg">Price Movement Analysis</h3>
                   <div className="flex gap-2">
                      {['1D', '1W', '1M', 'YTD'].map(t => (
                        <button key={t} className={`px-3 py-1 text-xs font-bold rounded-full ${t === '1M' ? 'bg-slate-900 text-white' : 'text-slate-400 hover:bg-slate-100'}`}>{t}</button>
                      ))}
                   </div>
                 </div>
                 
                 <div className="h-[350px] w-full">
                    <PriceForecastChart />
                 </div>
              </div>

            </div>

            {/* Sidebar Section (1/3) */}
            <div className="lg:col-span-1">
               <DashboardSidebar />
            </div>

          </div>

          {/* Footer */}
          <footer className="mt-16 pb-8 text-center">
            <p className="text-xs text-slate-400 font-medium tracking-widest uppercase">
              &copy; {new Date().getFullYear()} GIBEI Telkom University &bull; Forecasting Intelligence
            </p>
          </footer>
        </main>
      </div>
    </div>
  );
}
