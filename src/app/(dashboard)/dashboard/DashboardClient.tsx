'use client';

import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/components/providers/ToastProvider';
import DashboardNavbar from '@/components/dashboard/DashboardNavbar';
import DashboardMetrics from '@/components/dashboard/DashboardMetrics';
import SearchModal from '@/components/dashboard/SearchModal';
import PriceForecastChart from '@/components/dashboard/PriceForecastChart';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import type { StockSignal } from '@/lib/types/signal';
import type { ForecastHorizon } from '@/lib/utils/forecast';

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
  const [signal, setSignal] = useState<StockSignal | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [horizon, setHorizon] = useState<ForecastHorizon>('1W');
  const { showToast, hideToast } = useToast();

  /** Fetch sinyal dari API route internal Next.js */
  const fetchSignal = useCallback(async (ticker: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/signals/${ticker.toUpperCase()}`);
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error ?? `HTTP ${res.status}`);
      }
      const data: StockSignal = await res.json();
      setSignal(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      showToast(`Failed to fetch ${ticker}: ${msg}`, 'error');
      setSignal(null);
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  // Initial load
  useEffect(() => {
    fetchSignal('BBCA');
  }, [fetchSignal]);

  const handleSearch = (newQuery: string) => {
    if (!newQuery) return;
    const ticker = newQuery.toUpperCase();
    const toastId = showToast(`Analyzing ${ticker}...`, 'loading');
    setQuery(ticker);
    setIsSearchOpen(false);
    fetchSignal(ticker).then(() => {
      hideToast(toastId);
      showToast(`Analysis complete for ${ticker}`, 'success');
    });
  };

  const resetSearch = () => {
    setQuery('BBCA');
    setIsSearchOpen(true);
  };

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
          
          <DashboardMetrics query={query} signal={signal} isLoading={isLoading} horizon={horizon} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Main Chart Section (2/3) */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Chart Card */}
              <div className="bg-white p-6 sm:p-8 rounded-4xl border border-slate-100 shadow-sm">
                 <div className="flex justify-between items-center mb-6">
                   <h3 className="font-bold text-slate-800 text-lg">Price Movement Analysis</h3>
                   <div className="flex gap-2">
                      {(['1D', '1W', '1M'] as ForecastHorizon[]).map(t => (
                        <button 
                          key={t}
                          onClick={() => setHorizon(t)} 
                          className={`px-3 py-1 text-xs font-bold rounded-full transition-colors ${horizon === t ? 'bg-slate-900 text-white' : 'text-slate-400 hover:bg-slate-100'}`}
                        >
                          {t}
                        </button>
                      ))}
                   </div>
                 </div>
                 
                 <div className="h-[350px] w-full">
                    <PriceForecastChart signal={signal} isLoading={isLoading} horizon={horizon} />
                 </div>
              </div>

            </div>

            {/* Sidebar Section (1/3) */}
            <div className="lg:col-span-1">
               <DashboardSidebar signal={signal} isLoading={isLoading} />
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
