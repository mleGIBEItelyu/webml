
'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Search, X, LogOut, Activity,
  BarChart3, Compass, TrendingUp, ChevronRight, AlertCircle
} from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';
import { useToast } from '@/components/providers/ToastProvider';
import {
  ComposedChart,
  Line,
  Area,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
} from 'recharts';

// --- TYPES & UTILS ---

type ForecastHorizon = '1D' | '1W' | '1M';

interface StockSignal {
  ticker: string;
  date: string;
  last_close: number;
  pred_7d_close: number;
  return_7d_pct: number;
  range_min_pct: number;
  range_max_pct: number;
  signal: string;
  confidence: number;
  volume: number;
  historical_dates: string[];
  historical_prices: number[];
  historical_volumes: number[];
}

function scaleForecast(signal: StockSignal | null, horizon: ForecastHorizon) {
  if (!signal) return null;
  const factor = horizon === '1D' ? 1 / 7 : horizon === '1M' ? 30 / 7 : 1;
  const predReturn = (signal.pred_7d_close - signal.last_close) * factor;
  return {
    predClose: signal.last_close + predReturn,
    returnPct: signal.return_7d_pct * factor,
    rangeMinPct: signal.range_min_pct * factor,
    rangeMaxPct: signal.range_max_pct * factor
  };
}

function formatRupiah(value: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value);
}

// --- SUB-COMPONENTS ---

function LogoutConfirmModal({ isOpen, onCancel, onConfirm }: { isOpen: boolean; onCancel: () => void; onConfirm: () => void }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm animate-in fade-in duration-200" onClick={onCancel} />
      <div className="w-full max-w-sm bg-white rounded-xl shadow-2xl border border-slate-200 transform animate-in fade-in zoom-in-95 duration-200 relative z-10 p-6">
        <h3 className="text-lg font-bold text-slate-900 mb-2">Sign Out</h3>
        <p className="text-sm text-slate-500 mb-6">Are you sure you want to sign out of your account?</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 px-4 py-2 border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
            Cancel
          </button>
          <button onClick={onConfirm} className="flex-1 px-4 py-2 bg-rose-600 rounded-lg text-sm font-semibold text-white hover:bg-rose-700 transition-colors">
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}

function SearchCommandPalette({ isOpen, onClose, onSearch }: { isOpen: boolean; onClose: () => void; onSearch: (q: string) => void }) {
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setInputValue(''); // Reset on open
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  const popularTickers = ['BBCA', 'BBRI', 'BMRI', 'BBNI', 'TLKM', 'ASII', 'GOTO'];
  const filteredTickers = popularTickers.filter(t => t.includes(inputValue.toUpperCase()));

  return (
    <div className="fixed inset-0 z-100 flex items-start justify-center pt-[15vh] px-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose} />

      {/* Modal Container */}
      <div className="w-full max-xl bg-white rounded-xl shadow-2xl border border-slate-200 transform animate-in fade-in slide-in-from-top-4 duration-200 relative z-10 overflow-hidden flex flex-col max-h-[60vh] max-w-xl">
        {/* Input Area */}
        <div className="relative flex items-center border-b border-slate-100 px-4">
          <Search className="w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search ticker symbol (e.g., BBCA)"
            className="w-full py-4 px-3 bg-transparent text-lg text-slate-900 placeholder:text-slate-400 focus:outline-none uppercase"
            maxLength={4}
            autoFocus
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value.toUpperCase().slice(0, 4))}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && inputValue.trim()) {
                onSearch(inputValue);
              } else if (e.key === 'Escape') {
                onClose();
              }
            }}
          />
          <button onClick={onClose} className="p-1 rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Suggestions Area */}
        <div className="overflow-y-auto p-2">
          <div className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            {inputValue ? 'Search Results' : 'Popular Assets'}
          </div>
          <div className="mt-1">
            {(inputValue ? filteredTickers : popularTickers).map((code) => (
              <button
                key={code}
                onClick={() => onSearch(code)}
                className="w-full flex items-center justify-between px-3 py-3 rounded-lg hover:bg-slate-50 text-slate-700 hover:text-blue-600 group transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-slate-100 border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-600 group-hover:bg-blue-50 group-hover:border-blue-100 group-hover:text-blue-600">
                    {code.charAt(0)}
                  </div>
                  <span className="font-medium text-sm">{code}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500" />
              </button>
            ))}
            {inputValue && filteredTickers.length === 0 && (
              <div className="px-3 py-4 text-sm text-slate-500 text-center">
                Press enter to search for <span className="font-bold text-slate-700">{inputValue}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function PriceForecastChart({ signal, isLoading, horizon }: { signal: StockSignal | null; isLoading: boolean; horizon: ForecastHorizon }) {
  if (isLoading) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-slate-50/50 rounded-lg border border-dashed border-slate-200">
        <div className="flex flex-col items-center gap-3">
          <div className="w-6 h-6 border-2 border-slate-200 border-t-blue-600 rounded-full animate-spin" />
          <span className="text-xs text-slate-500 font-medium">Processing market data...</span>
        </div>
      </div>
    );
  }
  if (!signal) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-slate-50/50 rounded-lg border border-dashed border-slate-200 text-sm text-slate-500 flex-col gap-2">
        <AlertCircle className="w-6 h-6 text-slate-400" />
        No data available for this asset.
      </div>
    );
  }

  const data = useMemo(() => {
    let histDates = signal.historical_dates || [];
    let histPrices = signal.historical_prices || [];
    let histVolumes = signal.historical_volumes || [];

    // Scale history visual based on horizon
    if (horizon === '1D') { histDates = histDates.slice(-5); histPrices = histPrices.slice(-5); histVolumes = histVolumes.slice(-5); }
    else if (horizon === '1W') { histDates = histDates.slice(-14); histPrices = histPrices.slice(-14); histVolumes = histVolumes.slice(-14); }

    interface ChartPoint {
      displayDate: string;
      actual: number | null;
      forecast: number | null;
      upper: number | null;
      lower: number | null;
      volume: number;
      isForecast: boolean;
    }

    const chartData: ChartPoint[] = histDates.map((date, i) => ({
      displayDate: new Date(date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' }),
      actual: histPrices[i],
      forecast: null,
      upper: null,
      lower: null,
      volume: histVolumes[i],
      isForecast: false,
    }));

    // Inject LIVE point
    chartData.push({
      displayDate: 'LIVE', actual: signal.last_close, forecast: signal.last_close,
      upper: signal.last_close, lower: signal.last_close, volume: signal.volume, isForecast: false,
    });

    const scaled = scaleForecast(signal, horizon);
    if (scaled) {
      const horizonLabel = horizon === '1D' ? '+1D Target' : horizon === '1M' ? '+1M Target' : '+1W Target';
      chartData.push({
        displayDate: horizonLabel, actual: null, forecast: Math.round(scaled.predClose),
        upper: Math.round(signal.last_close * (1 + scaled.rangeMaxPct / 100)),
        lower: Math.round(signal.last_close * (1 + scaled.rangeMinPct / 100)),
        volume: 0, isForecast: true,
      });
    }
    return chartData;
  }, [signal, horizon]);

  const minPrice = Math.min(...data.map(d => d.actual || d.forecast || 0).filter(Boolean)) * 0.98;
  const maxPrice = Math.max(...data.map(d => d.actual || d.upper || d.forecast || 0).filter(Boolean)) * 1.02;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart data={data} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2563eb" stopOpacity={0.1} />
            <stop offset="100%" stopColor="#2563eb" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#64748b" stopOpacity={0.05} />
            <stop offset="100%" stopColor="#64748b" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke="#f1f5f9" />
        <XAxis
          dataKey="displayDate"
          axisLine={false}
          tickLine={false}
          tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }}
          dy={10}
        />
        <YAxis
          yAxisId="price"
          axisLine={false}
          tickLine={false}
          tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }}
          domain={[minPrice, maxPrice]}
          tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
          orientation="right"
          dx={10}
        />
        <YAxis yAxisId="volume" hide domain={[0, Math.max(...data.map(d => d.volume)) * 5]} />

        <RechartsTooltip
          content={({ active, payload }) => {
            if (!active || !payload?.length) return null;
            const point = payload[0].payload;
            return (
              <div className="bg-white border border-slate-200 shadow-lg rounded-lg p-4 min-w-[220px]">
                <p className="text-xs font-semibold text-slate-500 mb-3 pb-2 border-b border-slate-100">
                  {point.displayDate}
                </p>
                <div className="space-y-2">
                  {payload.map((p, i) => p.value && p.name !== 'upper' && p.name !== 'lower' ? (
                    <div key={i} className="flex justify-between items-center text-sm">
                      <span className="text-slate-600 capitalize text-xs">{p.name === 'actual' ? 'Actual Price' : p.name === 'forecast' ? 'Forecast Target' : 'Volume'}</span>
                      <span className={`font-semibold ${p.name === 'forecast' ? 'text-blue-600' : 'text-slate-900'}`}>
                        {p.name === 'volume' ? p.value.toLocaleString() : formatRupiah(Number(p.value))}
                      </span>
                    </div>
                  ) : null)}
                  {point.isForecast && point.upper && point.lower && (
                    <div className="pt-2 mt-2 border-t border-slate-100 flex justify-between items-center text-xs">
                      <span className="text-slate-500">Confidence Range</span>
                      <span className="text-slate-700 font-medium">
                        {formatRupiah(point.lower)} - {formatRupiah(point.upper)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          }}
          cursor={{ stroke: '#e2e8f0', strokeWidth: 1, strokeDasharray: '4 4' }}
        />

        <Bar yAxisId="volume" dataKey="volume" fill="#f1f5f9" radius={[2, 2, 0, 0]} />
        <Area yAxisId="price" type="monotone" dataKey="upper" stroke="none" fill="url(#colorForecast)" connectNulls />
        <Area yAxisId="price" type="monotone" dataKey="actual" stroke="none" fill="url(#colorActual)" connectNulls={false} />

        <Line yAxisId="price" type="monotone" dataKey="actual" stroke="#0f172a" strokeWidth={2} dot={{ r: 3, fill: '#0f172a', strokeWidth: 0 }} activeDot={{ r: 5 }} connectNulls={false} />
        <Line yAxisId="price" type="monotone" dataKey="forecast" stroke="#2563eb" strokeWidth={2} strokeDasharray="4 4" dot={{ r: 3, fill: '#2563eb', strokeWidth: 0 }} connectNulls />

        <ReferenceLine yAxisId="price" x="LIVE" stroke="#cbd5e1" strokeWidth={1} strokeDasharray="3 3" />
      </ComposedChart>
    </ResponsiveContainer>
  );
}

// --- MAIN DASHBOARD PAGE ---

export default function DashboardPage() {
  const { data: session } = useSession();
  const { showToast, hideToast } = useToast();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [query, setQuery] = useState('BBCA');
  const [signal, setSignal] = useState<StockSignal | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [horizon, setHorizon] = useState<ForecastHorizon>('1W');

  const fetchSignal = useCallback(async (ticker: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/predict/${ticker.toUpperCase()}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: StockSignal = await res.json();
      setSignal(data);
    } catch {
      console.error(`Failed to fetch ${ticker}`);
      showToast(`Failed to fetch ${ticker}`, 'error');
      setSignal(null);
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchSignal('BBCA');

    // Global keyboard shortcut to open search
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [fetchSignal]);

  const handleSearch = (q: string) => {
    const ticker = q.toUpperCase();
    const toastId = showToast(`Fetching ${ticker}...`, 'loading');
    setQuery(ticker);
    setIsSearchOpen(false);
    fetchSignal(ticker).then(() => {
      hideToast(toastId);
    });
  };

  const handleSignOut = async () => {
    setShowLogoutConfirm(false);
    const toastId = showToast('Signing out...', 'loading');
    await signOut({ callbackUrl: '/login' });
    hideToast(toastId);
  };

  const scaled = scaleForecast(signal, horizon);
  const isPositive = (scaled?.returnPct ?? 0) >= 0;

  // Formatters
  const pctString = scaled ? `${isPositive ? '+' : ''}${scaled.returnPct.toFixed(2)}%` : '0.00%';
  const statusColor = isPositive ? 'text-emerald-600' : 'text-rose-600';
  const statusBg = isPositive ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">

      <SearchCommandPalette isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} onSearch={handleSearch} />
      <LogoutConfirmModal isOpen={showLogoutConfirm} onCancel={() => setShowLogoutConfirm(false)} onConfirm={handleSignOut} />

      {/* Clean Top Navigation */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setQuery('BBCA')}>
              <div className="w-8 h-8 rounded-md flex items-center justify-center overflow-hidden">
                <img src="/logo.png" alt="GIBEI Logo" className="w-full h-full object-contain" />
              </div>
              <span className="font-bold text-slate-900 tracking-tight text-lg hidden sm:block">GIBEI</span>
              <span className="text-lg font-bold text-red-500 hidden sm:block">Forecasting</span>
            </div>
          </div>

          <div className="flex-1 max-w-md mx-4">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="w-full bg-slate-100 hover:bg-slate-200 border border-transparent transition-colors rounded-lg py-2 px-3 text-sm font-medium text-slate-500 flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-slate-400" />
                <span>Search assets...</span>
              </div>
               <kbd className="hidden sm:inline-flex items-center gap-1 font-sans text-[10px] bg-white border border-slate-200 rounded px-1.5 py-0.5 text-slate-400 font-medium">
                 <span className="text-xs">Ctrl/⌘</span>K
               </kbd>
            </button>
          </div>

          <div className="flex items-center gap-4">
            {session?.user && (
              <div className="flex items-center gap-2 pr-4 border-r border-slate-200">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-600 border border-slate-200 uppercase">
                  {session.user.name?.charAt(0) || 'U'}
                </div>
                <span className="text-sm font-semibold text-slate-700 hidden lg:block max-w-[120px] truncate">
                  {session.user.name}
                </span>
              </div>
            )}
            <button onClick={() => setShowLogoutConfirm(true)} className="text-sm font-medium text-slate-500 hover:text-rose-600 transition-colors flex items-center gap-2">
              <span className="hidden sm:inline">Sign out</span>
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8">

        {/* Page Header & Primary Metrics */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{query}</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-600">
                IDX Asset
              </span>
            </div>
            <p className="text-sm text-slate-500">Machine Learning Price Forecast & Analytics</p>
          </div>

          <div className="flex flex-col md:items-end gap-1">
            <div className="text-sm font-medium text-slate-500 mb-1">Last Market Close</div>
            <div className="flex items-baseline gap-3">
              {isLoading ? (
                <div className="h-10 w-32 bg-slate-200 animate-pulse rounded" />
              ) : (
                <>
                  <span className="text-4xl font-bold text-slate-900 tracking-tight">
                    {signal ? formatRupiah(signal.last_close) : '—'}
                  </span>
                  {signal && (
                    <span className={`text-sm font-semibold px-2 py-1 rounded-md ${statusBg}`}>
                      {pctString} ({horizon})
                    </span>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Main Chart Section */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col h-[500px]">
              {/* Chart Header */}
              <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h2 className="text-base font-semibold text-slate-800">Forecast Trajectory</h2>
                <div className="flex bg-slate-100 p-1 rounded-md border border-slate-200">
                  {(['1D', '1W', '1M'] as ForecastHorizon[]).map(t => (
                    <button
                      key={t}
                      onClick={() => setHorizon(t)}
                      className={`px-3 py-1 text-xs font-semibold rounded transition-colors ${horizon === t ? 'bg-white text-slate-900 shadow-sm border border-slate-200/50' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              {/* Chart Body */}
              <div className="flex-1 p-6 pb-2 min-h-0">
                <PriceForecastChart signal={signal} isLoading={isLoading} horizon={horizon} />
              </div>
            </div>

            {/* Bottom Summary Row (optional secondary metrics) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: 'Min Predicted', val: scaled ? formatRupiah(signal!.last_close * (1 + scaled.rangeMinPct / 100)) : '—' },
                { label: 'Max Predicted', val: scaled ? formatRupiah(signal!.last_close * (1 + scaled.rangeMaxPct / 100)) : '—' },
                { label: 'Target Return', val: pctString, color: statusColor },
                { label: 'Latest Vol', val: signal?.volume ? `${(signal.volume / 1000000).toFixed(2)}M` : '—' },
              ].map((m, i) => (
                <div key={i} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                  <p className="text-xs font-medium text-slate-500 mb-1">{m.label}</p>
                  <p className={`text-sm font-semibold ${m.color || 'text-slate-900'}`}>{m.val}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Sidebar Analytics */}
          <div className="lg:col-span-4 flex flex-col gap-6">

            {/* Recommendation Card */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50">
                <h3 className="text-sm font-semibold text-slate-800">AI Recommendation</h3>
              </div>
              <div className="p-6 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center mb-4">
                  <Compass className="w-8 h-8 text-blue-600" />
                </div>
                <div className="text-2xl font-bold text-slate-900 uppercase tracking-wide mb-1">
                  {signal?.signal || 'WAIT & SEE'}
                </div>
                <p className="text-sm text-slate-500 mb-6">Based on {horizon} market pattern analysis</p>

                <div className="w-full">
                  <div className="flex justify-between text-xs font-medium mb-2">
                    <span className="text-slate-500">Model Confidence</span>
                    <span className="text-slate-900">{signal?.confidence.toFixed(1) ?? 0}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 transition-all duration-1000 ease-out"
                      style={{ width: `${signal?.confidence ?? 0}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Key Indicators */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5">
              <h3 className="text-sm font-semibold text-slate-800 mb-4">Key Indicators</h3>
              <div className="space-y-4">
                {[
                  { label: 'Volatility State', val: signal ? ((signal.range_max_pct - signal.range_min_pct) > 10 ? 'Elevated' : 'Stable') : '—', icon: Activity, bg: 'bg-orange-50', fg: 'text-orange-600' },
                  { label: 'Volume Trend', val: 'Average', icon: BarChart3, bg: 'bg-cyan-50', fg: 'text-cyan-600' },
                  { label: 'Forecast Price', val: scaled ? formatRupiah(scaled.predClose) : '—', icon: TrendingUp, bg: 'bg-indigo-50', fg: 'text-indigo-600' }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 p-3 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors">
                    <div className={`w-10 h-10 rounded-md flex items-center justify-center ${item.bg}`}>
                      <item.icon className={`w-5 h-5 ${item.fg}`} />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-slate-500">{item.label}</p>
                      <p className="text-sm font-semibold text-slate-900">{item.val}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </main>
    </div>
  );
}