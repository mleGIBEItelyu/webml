'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import { 
  Activity, 
  Target, 
  TrendingUp, 
  Zap,
  Calendar,
  Download,
  ChevronDown 
} from 'lucide-react';
import PriceForecastChart from '@/components/dashboard/PriceForecastChart';

// --- Reusable Modern Card Component ---
const GlassCard = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <div className={`bg-white rounded-3xl shadow-[0_2px_20px_rgb(0,0,0,0.04)] border border-slate-100 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all duration-300 ${className}`}>
    {children}
  </div>
);

const StatBadge = ({ type, text }: { type: 'success' | 'warning' | 'danger' | 'neutral', text: string }) => {
  const styles = {
    success: 'bg-emerald-50 text-emerald-600',
    warning: 'bg-amber-50 text-amber-600',
    danger: 'bg-rose-50 text-rose-600',
    neutral: 'bg-slate-50 text-slate-600',
  };
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-bold tracking-wide ${styles[type]}`}>
      {text}
    </span>
  );
};

export default function DashboardPage() {
  const [isSearchOpen, setIsSearchOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [timeRange, setTimeRange] = useState('1M');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchOpen(false);
      // Future: load data for searchQuery
    }
  };

  return (
    <div className={`min-h-screen bg-[#FAFAFA] text-slate-800 font-sans selection:bg-red-100 selection:text-red-900 pb-12 relative ${isSearchOpen ? 'h-screen overflow-hidden' : ''}`}>
      
      {/* Search Modal Overlay */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md transition-all duration-300">
          <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-lg border border-gray-100 transform scale-100 animate-in fade-in zoom-in duration-200">
            <div className="text-center mb-8">
              <div className="mx-auto w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
                <Search className="w-8 h-8 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Mulai Analisis Saham</h2>
              <p className="text-gray-500">Masukkan kode saham untuk melihat prediksi dan analisis (contoh: BBCA, TLKM)</p>
            </div>

            <form onSubmit={handleSearch} className="space-y-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value.toUpperCase())}
                  className="block w-full pl-11 pr-4 py-4 bg-gray-50 border-0 ring-1 ring-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-red-500 focus:bg-white text-lg transition-all"
                  placeholder="Kode Saham..."
                  autoFocus
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full py-4 px-6 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl shadow-lg shadow-red-500/20 transition-all duration-200 text-lg"
              >
                Analisis Sekarang
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Main Content with Blur Effect when Modal is Open */}
      <div className={`transition-all duration-500 ${isSearchOpen ? 'blur-sm scale-[0.99] pointer-events-none grayscale-[0.5]' : ''}`}>
        
        {/* --- Navbar (Floating Style) --- */}
        <nav className="sticky top-4 z-40 px-4 sm:px-6 mb-8">
          <div className="max-w-7xl mx-auto bg-white/80 backdrop-blur-xl rounded-2xl shadow-sm border border-white/50 px-6 py-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              {/* Logo */}
              <div className="w-10 h-10 relative">
                  <img src="/logo.png" alt="GIBEI Logo" className="w-full h-full object-contain" />
              </div>
              <div>
                <h1 className="font-bold text-lg leading-tight tracking-tight">GIBEI <span className="font-bold text-red-600">Forecasting</span></h1>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <span className="text-xs font-medium text-slate-400 hidden sm:block bg-slate-50 px-3 py-1.5 rounded-full">
                Updated: {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
              <button className="p-2.5 hover:bg-slate-50 rounded-xl text-slate-600 transition-colors border border-transparent hover:border-slate-100">
                <Download className="w-5 h-5" />
              </button>
              <button className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-medium hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10">
                <span>Export Report</span>
                <ChevronDown className="w-4 h-4 opacity-50" />
              </button>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto px-4 sm:px-6">
          
          {/* --- Header Section --- */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 px-2">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-lg text-xs font-bold tracking-wide">{searchQuery || 'BBCA'}</span>
                <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Bank Central Asia Tbk</h2>
              </div>
              <p className="text-slate-500 font-medium">AI-Driven Price Forecasting & Analysis Dashboard</p>
            </div>
            
            {/* Time Range Selector */}
            <div className="bg-white p-1.5 rounded-2xl shadow-sm border border-slate-100 inline-flex">
              {['1D', '5D', '1M', '3M', 'YTD'].map((range) => (
                <button 
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-200 ${
                    timeRange === range 
                      ? 'bg-slate-900 text-white shadow-md' 
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>

          {/* --- KPI Cards Grid --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            
            {/* Card 1: Harga Hari Ini */}
            <GlassCard className="p-6 relative group">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-blue-50 rounded-2xl text-blue-600 group-hover:scale-110 transition-transform">
                    <Activity className="w-6 h-6" />
                </div>
                <StatBadge type="success" text="+1.2% Daily" />
              </div>
              <p className="text-sm text-slate-500 font-medium mb-1">Harga Hari Ini</p>
              <h3 className="text-3xl font-bold text-slate-900">Rp 9,850</h3>
              <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-all"></div>
            </GlassCard>

            {/* Card 2: Prediksi Besok */}
            <GlassCard className="p-6 relative group">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-orange-50 rounded-2xl text-orange-600 group-hover:scale-110 transition-transform">
                    <Target className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-1 text-xs font-semibold text-slate-400 bg-slate-50 px-2 py-1 rounded-lg">
                    <span className="w-2 h-2 rounded-full bg-orange-400"></span>
                    78% Conf.
                </div>
              </div>
              <p className="text-sm text-slate-500 font-medium mb-1">Prediksi Besok (D+1)</p>
              <h3 className="text-3xl font-bold text-slate-900">Rp 9,920</h3>
            </GlassCard>

            {/* Card 3: Trend */}
            <GlassCard className="p-6 relative group">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600 group-hover:scale-110 transition-transform">
                    <TrendingUp className="w-6 h-6" />
                </div>
                <StatBadge type="success" text="65% Prob." />
              </div>
              <p className="text-sm text-slate-500 font-medium mb-1">Trend 7 Hari</p>
              <h3 className="text-3xl font-bold text-slate-900">Bullish</h3>
            </GlassCard>

            {/* Card 4: MAPE */}
            <GlassCard className="p-6 relative group">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-purple-50 rounded-2xl text-purple-600 group-hover:scale-110 transition-transform">
                    <Zap className="w-6 h-6" />
                </div>
                <span className="text-emerald-600 text-xs font-bold flex items-center bg-emerald-50 px-2 py-1 rounded-lg">
                  <TrendingUp className="w-3 h-3 mr-1" /> Improved
                </span>
              </div>
              <p className="text-sm text-slate-500 font-medium mb-1">MAPE Model</p>
              <h3 className="text-3xl font-bold text-slate-900">2.31%</h3>
            </GlassCard>

          </div>

          {/* --- Main Content Split --- */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left: Main Chart (2/3 width) */}
            <div className="lg:col-span-2 space-y-6">
               <PriceForecastChart />
            </div>

            {/* Right: Insights Sidebar (1/3 width) */}
            <div className="space-y-6">
              
              {/* Widget 1: Target Price */}
              <GlassCard className="p-6">
                  <div className="flex items-center gap-2 mb-6">
                      <div className="bg-orange-100 p-2 rounded-lg text-orange-600">
                          <Calendar className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Forecast 30 Hari</span>
                  </div>
                  
                  <div className="mb-8">
                      <p className="text-sm text-slate-500 font-medium mb-1">Target Price</p>
                      <div className="flex items-end gap-3">
                          <span className="text-4xl font-bold text-slate-900 tracking-tight">Rp 10,300</span>
                          <span className="mb-1.5 bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-1 rounded-md">+4.6%</span>
                      </div>
                  </div>

                  <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                          <span className="text-sm font-medium text-slate-600">Risk Level</span>
                          <span className="text-sm font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-lg">Medium</span>
                      </div>
                      
                      <div className="p-4 bg-slate-50 rounded-2xl">
                           <div className="flex justify-between items-center mb-2">
                               <span className="text-sm font-medium text-slate-600">Volatility Index</span>
                               <span className="text-sm font-bold text-rose-600">High</span>
                           </div>
                           <div className="w-full bg-slate-200 rounded-full h-2">
                              <div className="bg-gradient-to-r from-orange-400 to-rose-500 h-2 rounded-full" style={{width: '75%'}}></div>
                           </div>
                           <p className="text-right text-xs text-slate-400 mt-2 font-medium">Std Dev: 2.9%</p>
                      </div>
                  </div>
              </GlassCard>

              {/* Widget 2: Model Status */}
              <div className="bg-slate-900 rounded-3xl p-6 shadow-2xl shadow-slate-900/20 text-white relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-red-600/20 rounded-full blur-[50px] -mr-10 -mt-10 group-hover:bg-red-600/30 transition-all duration-700"></div>
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-600/10 rounded-full blur-[40px] -ml-10 -mb-10"></div>
                  
                  <div className="relative z-10">
                      <div className="flex items-center gap-3 mb-6">
                          <div className="p-2 bg-white/10 rounded-xl backdrop-blur-md">
                              <Zap className="w-5 h-5 text-red-400" />
                          </div>
                          <h3 className="font-bold text-lg">Model Status</h3>
                      </div>

                      <div className="space-y-5">
                          <div className="flex justify-between items-center border-b border-white/10 pb-3">
                              <span className="text-slate-400 text-sm">Type</span>
                              <span className="font-mono font-bold text-red-400 bg-red-500/10 px-2 py-0.5 rounded">LSTM v2.4</span>
                          </div>
                          <div className="flex justify-between items-center border-b border-white/10 pb-3">
                              <span className="text-slate-400 text-sm">Training Data</span>
                              <span className="font-bold">5 Years</span>
                          </div>
                          <div className="flex justify-between items-center">
                              <span className="text-slate-400 text-sm">Last Retrain</span>
                              <span className="font-bold">1 Feb 2026</span>
                          </div>
                      </div>

                      <button className="w-full mt-8 py-3 bg-white text-slate-900 rounded-xl text-sm font-bold hover:bg-slate-100 transition-colors shadow-lg">
                          View Model Details
                      </button>
                  </div>
              </div>

            </div>
          </div>
        </main>
      </div>
    </div>
  );
}