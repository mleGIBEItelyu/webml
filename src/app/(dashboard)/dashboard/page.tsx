'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  Activity, 
  Search, 
  X,
  LogOut, 
  ShieldCheck,
  ChevronRight,
  ChevronLeft,
  Calendar,
  Compass,
  AlertCircle
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

type ForecastHorizon = '1W' | '1M' | 'ALL';

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

interface ChartPoint {
  displayDate: string;
  actual: number | null;
  forecast: number | null;
  upper: number | null;
  lower: number | null;
  volume: number;
  isForecast: boolean;
  rawDate: string;
}

function scaleForecast(signal: StockSignal | null, horizon: ForecastHorizon) {
  if (!signal) return null;
  
  // Midpoint represents the "safe" 1M return base
  const midPointPct = (signal.range_min_pct + signal.range_max_pct) / 2;
  
  // The API range is now treated as the 1M (30-day) baseline
  // 1W: ~7 days (~0.23x), 1M/ALL: 30 days (1x)
  const factor = horizon === '1W' ? 7 / 30 : 1; 
  
  const returnPct = midPointPct * factor;
  const rangeMinPct = signal.range_min_pct * factor;
  const rangeMaxPct = signal.range_max_pct * factor;
  
  const predReturn = (signal.last_close * (returnPct / 100));
  
  return {
    predClose: signal.last_close + predReturn,
    returnPct,
    rangeMinPct,
    rangeMaxPct
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
    <div className="fixed inset-0 z-110 flex items-center justify-center px-4">
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

function PriceForecastChart({ 
  signal, 
  isLoading, 
  horizon, 
  data, 
  onHover, 
  onMouseOut 
}: { 
  signal: StockSignal | null; 
  isLoading: boolean; 
  horizon: ForecastHorizon;
  data: ChartPoint[];
  onHover: (point: ChartPoint | null) => void;
  onMouseOut: () => void;
}) {
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

  const minPrice = Math.min(...data.map(d => d.actual || d.forecast || 0).filter(Boolean)) * 0.98;
  const maxPrice = Math.max(...data.map(d => d.actual || d.upper || d.forecast || 0).filter(Boolean)) * 1.02;

  const currentScaled = scaleForecast(signal, horizon);
  const currentReturnPct = currentScaled?.returnPct ?? 0;
  const isConfident = (signal?.confidence ?? 0) >= 70;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart 
        data={data} 
        margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
        onMouseMove={(state: any) => {
          if (state && state.activePayload && state.activePayload.length > 0) {
            onHover(state.activePayload[0].payload);
          }
        }}
        onMouseLeave={onMouseOut}
      >
        <defs>
          <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2563eb" stopOpacity={0.15} />
            <stop offset="100%" stopColor="#2563eb" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#94a3b8" stopOpacity={0.05} />
            <stop offset="100%" stopColor="#94a3b8" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke="#f1f5f9" />
        <XAxis
          dataKey="displayDate"
          axisLine={false}
          tickLine={false}
          tick={{ fill: '#64748b', fontSize: 10, fontWeight: 600 }}
          dy={10}
        />
        <YAxis
          yAxisId="price"
          axisLine={false}
          tickLine={false}
          tick={{ fill: '#64748b', fontSize: 10, fontWeight: 600 }}
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
            const isConfident = (signal?.confidence ?? 0) >= 70;
            const scaled = scaleForecast(signal, horizon);
            const returnPct = scaled?.returnPct ?? 0;
            const clr = !isConfident ? 'text-slate-400' : returnPct > 0 ? 'text-emerald-500' : returnPct < 0 ? 'text-rose-500' : 'text-slate-500';
            const horizonLabel = horizon === '1W' ? 'Expected Target (1W)' : 'Expected Target (1M)';

            const filteredPayload = payload.filter((p, idx, self) => 
              ['actual', point.isForecast ? null : 'volume'].includes(p.name as string) &&
              idx === self.findIndex((t) => t.name === p.name)
            );

            return (
              <div className="bg-white border border-slate-200 shadow-lg rounded-lg p-4 min-w-[220px]">
                <p className="text-xs font-semibold text-slate-500 mb-3 pb-2 border-b border-slate-100">
                  {point.displayDate}
                </p>
                <div className="space-y-2">
                  {filteredPayload.map((p, i) => (
                    <div key={i} className="flex justify-between items-center text-sm">
                      <span className="text-slate-600 capitalize text-xs">
                        {p.name === 'actual' ? 'Actual Price' : p.name === 'forecast' ? horizonLabel : 'Volume'}
                      </span>
                      <span className={`font-semibold ${p.name === 'forecast' ? 'text-blue-600' : 'text-slate-900'}`}>
                        {p.name === 'volume' ? Number(p.value).toLocaleString() : formatRupiah(Number(p.value))}
                      </span>
                    </div>
                  ))}

                  {point.isForecast && scaled && (
                    <div className="pt-2 mt-2 border-t border-slate-100 space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-500">Base Price</span>
                        <span className="text-slate-700 font-medium">{formatRupiah(signal.last_close)}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-500">Predicted Return</span>
                        <span className={`font-bold ${clr}`}>
                          {!isConfident ? 'WAIT & SEE' : `${scaled.returnPct >= 0 ? '+' : ''}${scaled.returnPct.toFixed(2)}%`}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-500">Target Price</span>
                        <span className="text-blue-600 font-bold">
                          {formatRupiah(scaled.predClose)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          }}
          cursor={{ stroke: '#e2e8f0', strokeWidth: 1, strokeDasharray: '4 4' }}
        />

        <Bar yAxisId="volume" dataKey="volume" fill="#cbd5e1" radius={[2, 2, 0, 0]} name="volume" />
        <Area yAxisId="price" type="monotone" dataKey="upper" stroke="none" fill="url(#colorForecast)" connectNulls name="upper" />
        <Area yAxisId="price" type="monotone" dataKey="actual" stroke="none" fill="url(#colorActual)" connectNulls={false} name="shadow" />

        <Line yAxisId="price" type="monotone" dataKey="actual" stroke="#0f172a" strokeWidth={2} dot={{ r: 3, fill: '#0f172a', strokeWidth: 0 }} activeDot={{ r: 5 }} connectNulls={false} name="actual" />
        <Line yAxisId="price" type="monotone" dataKey="forecast" stroke={!isConfident ? '#94a3b8' : currentReturnPct > 0 ? '#10b981' : currentReturnPct < 0 ? '#f43f5e' : '#2563eb'} strokeWidth={2} strokeDasharray="4 4" dot={{ r: 3, fill: !isConfident ? '#94a3b8' : currentReturnPct > 0 ? '#10b981' : currentReturnPct < 0 ? '#f43f5e' : '#2563eb', strokeWidth: 0 }} connectNulls name="forecast" />

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
  const [horizon, setHorizon] = useState<ForecastHorizon>('1M');
  const [hoveredPoint, setHoveredPoint] = useState<ChartPoint | null>(null);

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
  const confidenceThreshold = 70;
  const isConfident = (signal?.confidence ?? 0) >= confidenceThreshold;
  const isPositive = (scaled?.returnPct ?? 0) >= 0;

  // Formatters
  const pctString = scaled 
    ? (isConfident 
        ? `${isPositive ? '+' : ''}${scaled.returnPct.toFixed(2)}%`
        : 'WAIT & SEE')
    : '0.00%';
    
  const statusColor = !isConfident 
    ? 'text-slate-500' 
    : isPositive ? 'text-emerald-600' : 'text-rose-600';
    
  const statusBg = !isConfident
    ? 'bg-slate-100 text-slate-600'
    : isPositive ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700';

  const chartData = useMemo(() => {
    if (!signal) return [];
    let histDates = signal.historical_dates || [];
    let histPrices = signal.historical_prices || [];
    let histVolumes = signal.historical_volumes || [];

    // Scale history visual based on horizon (Default ALL shows everything)
    if (horizon === '1W') { histDates = histDates.slice(-14); histPrices = histPrices.slice(-14); histVolumes = histVolumes.slice(-14); }
    else if (horizon === '1M') { histDates = histDates.slice(-30); histPrices = histPrices.slice(-30); histVolumes = histVolumes.slice(-30); }

    const formatted: ChartPoint[] = histDates.map((date, i) => ({
      displayDate: new Date(date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' }),
      actual: histPrices[i],
      forecast: null,
      upper: null,
      lower: null,
      volume: histVolumes[i],
      isForecast: false,
      rawDate: date,
    }));

    // Inject LIVE point
    formatted.push({
      displayDate: 'LIVE', actual: signal.last_close, forecast: signal.last_close,
      upper: signal.last_close, lower: signal.last_close, volume: signal.volume, isForecast: false,
      rawDate: signal.date,
    });

    const scaled = scaleForecast(signal, horizon);
    if (scaled) {
      const horizonLabel = horizon === '1W' ? '+1W Target' : '+1M Target';
      formatted.push({
        displayDate: horizonLabel, actual: null, forecast: Math.round(scaled.predClose),
        upper: Math.round(signal.last_close * (1 + scaled.rangeMaxPct / 100)),
        lower: Math.round(signal.last_close * (1 + scaled.rangeMinPct / 100)),
        volume: 0, isForecast: true,
        rawDate: 'forecast',
      });
    }
    return formatted;
  }, [signal, horizon]);

  // Dynamic Indicator Logic
  const indicatorStats = useMemo(() => {
    if (!signal) return { vol: '', volState: '', volColor: '', volBg: '', volIcon: Activity };
    
    // Default state (period summary)
    if (!hoveredPoint) {
      // Trend calculation based on ChartData (Visible Window)
      const histOnly = chartData.filter(d => !d.isForecast && d.actual !== null);
      let trendLabel = 'Stable';
      let trendColor = 'text-slate-600';
      let trendBg = 'bg-slate-50';
      let trendIcon = Activity;

      if (histOnly.length > 1) {
        const startPrice = histOnly[0].actual!;
        const endPrice = histOnly[histOnly.length - 1].actual!;
        const changePct = ((endPrice - startPrice) / startPrice) * 100;

        if (changePct > 2) {
          trendLabel = 'Bullish';
          trendColor = 'text-emerald-600';
          trendBg = 'bg-emerald-50';
          trendIcon = TrendingUp;
        } else if (changePct < -2) {
          trendLabel = 'Bearish';
          trendColor = 'text-rose-600';
          trendBg = 'bg-rose-50';
          trendIcon = TrendingDown;
        }
      }

      // Volume Trend
      const avgVol = histOnly.reduce((acc, d) => acc + d.volume, 0) / (histOnly.length || 1);
      const lastVol = histOnly.length > 0 ? histOnly[histOnly.length - 1].volume : 0;
      const isAccumulating = lastVol > avgVol;

      // Volatility Calculation
      const prices = histOnly.map(d => d.actual!);
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      const rangePct = ((maxPrice - minPrice) / (minPrice || 1)) * 100;
      let volLabel = 'Low';
      let volStatColor = 'text-slate-600';
      let volStatBg = 'bg-slate-50';
      
      if (rangePct > 8) {
        volLabel = 'High';
        volStatColor = 'text-orange-600';
        volStatBg = 'bg-orange-50';
      } else if (rangePct > 4) {
        volLabel = 'Medium';
        volStatColor = 'text-amber-600';
        volStatBg = 'bg-amber-50';
      }

      return {
        price: scaled ? formatRupiah(scaled.predClose) : '-',
        priceLabel: 'Forecast Target',
        priceIcon: TrendingUp,
        priceBg: 'bg-indigo-50',
        priceFg: 'text-indigo-600',
        
        vol: trendLabel,
        volState: 'Market Trend',
        volColor: trendColor,
        volBg: trendBg,
        volIcon: trendIcon,

        volatility: volLabel,
        volatilityLabel: 'Market Volatility',
        volatilityIcon: Activity,
        volatilityBg: volStatBg,
        volatilityFg: volStatColor,
        
        volumeTrend: isAccumulating ? 'Accumulating' : 'Consolidating',
        volumeLabel: 'Volume Trend',
        volumeIcon: BarChart3,
        volumeBg: isAccumulating ? 'bg-cyan-50' : 'bg-slate-50',
        volumeFg: isAccumulating ? 'text-cyan-600' : 'text-slate-600',

        recommendation: isConfident ? (signal?.signal?.toUpperCase() || 'ACCURATE') : 'WAIT & SEE',
        recLabel: 'AI Recommendation',
        recIcon: Compass,
        recBg: isConfident ? 'bg-blue-50' : 'bg-amber-50',
        recFg: isConfident ? 'text-blue-600' : 'text-amber-600'
      };
    }

    // Hover state (specific data)
    const p = hoveredPoint;
    return {
      price: p.actual ? formatRupiah(p.actual) : p.forecast ? formatRupiah(p.forecast) : '-',
      priceLabel: p.isForecast ? 'Forecast Target' : 'Closing Price',
      priceIcon: p.isForecast ? TrendingUp : Activity,
      priceBg: 'bg-slate-50',
      priceFg: 'text-slate-600',
      
      vol: p.actual ? `${p.displayDate}` : 'N/A',
      volState: 'Period Context',
      volColor: 'text-blue-600',
      volBg: 'bg-blue-50',
      volIcon: Calendar,
      
      volumeTrend: p.volume ? `${(p.volume / 1000000).toFixed(2)}M` : '0.00',
      volumeLabel: 'Point Volume',
      volumeIcon: BarChart3,
      volumeBg: 'bg-slate-50',
      volumeFg: 'text-slate-600',

      volatility: 'N/A',
      volatilityLabel: 'Volatility',
      volatilityIcon: Activity,
      volatilityBg: 'bg-slate-50',
      volatilityFg: 'text-slate-600',

      recommendation: p.isForecast ? 'PREDICTION' : 'HISTORICAL',
      recLabel: 'Point Context',
      recIcon: Compass,
      recBg: 'bg-slate-50',
      recFg: 'text-slate-600'
    };
  }, [signal, hoveredPoint, scaled]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">

      <SearchCommandPalette isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} onSearch={handleSearch} />
      <LogoutConfirmModal isOpen={showLogoutConfirm} onCancel={() => setShowLogoutConfirm(false)} onConfirm={handleSignOut} />

      {/* Clean Top Navigation */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-10 h-16 sm:h-20 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 cursor-pointer shrink-0" onClick={() => setQuery('BBCA')}>
            <div className="w-8 h-8 rounded-md flex items-center justify-center overflow-hidden">
              <img src="/logo.png" alt="GIBEI Logo" className="w-full h-full object-contain" />
            </div>
            <span className="font-bold text-slate-900 tracking-tight text-lg hidden xs:block">GIBEI</span>
            <span className="text-lg font-bold text-red-500 hidden sm:block">Forecasting</span>
          </div>

          <div className="flex-1 max-w-sm sm:max-w-md">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="w-full bg-slate-100 hover:bg-slate-200 border border-transparent transition-colors rounded-lg py-1.5 sm:py-2 px-2 sm:px-3 text-xs sm:text-sm font-medium text-slate-500 flex items-center justify-between"
            >
              <div className="flex items-center gap-1.5 sm:gap-2 truncate">
                <Search className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="truncate">Search assets...</span>
              </div>
              <kbd className="hidden md:inline-flex items-center gap-1 font-sans text-[10px] bg-white border border-slate-200 rounded px-1.5 py-0.5 text-slate-400 font-medium whitespace-nowrap">
                <span className="text-xs">Ctrl/⌘</span>K
              </kbd>
            </button>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            {session?.user && (
              <div className="flex items-center gap-2 pr-2 sm:pr-4 border-r border-slate-200">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[9px] sm:text-[10px] font-bold text-slate-600 border border-slate-200 uppercase">
                  {session.user.name?.charAt(0) || 'U'}
                </div>
                <span className="text-xs sm:text-sm font-semibold text-slate-700 hidden md:block max-w-[80px] lg:max-w-[120px] truncate">
                  {session.user.name}
                </span>
              </div>
            )}
            <button onClick={() => setShowLogoutConfirm(true)} className="text-xs sm:text-sm font-medium text-slate-500 hover:text-rose-600 transition-colors flex items-center gap-1 sm:gap-2">
              <span className="hidden sm:inline">Sign out</span>
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[1800px] mx-auto px-6 sm:px-10 lg:px-16 2xl:px-24 pt-8 sm:pt-12 pb-32 sm:pb-48">

        {/* Page Header & Primary Metrics */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10 px-2 sm:px-0">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl sm:text-4xl 2xl:text-5xl font-bold text-slate-900 tracking-tight">{query}</h1>
              <span className="px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs sm:text-sm font-semibold text-slate-600">
                IDX Asset
              </span>
            </div>
            <p className="text-sm sm:text-base text-slate-500 font-medium">Machine Learning Price Forecast & Analytics</p>
          </div>

          <div className="flex flex-col md:items-end gap-1 px-2 sm:px-0">
            <div className="text-xs sm:text-sm font-medium text-slate-500 mb-1">Last Market Close</div>
            <div className="flex flex-wrap items-baseline gap-2 sm:gap-3">
              {isLoading ? (
                <div className="h-10 w-32 bg-slate-200 animate-pulse rounded" />
              ) : (
                <>
                  <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
                    {signal ? formatRupiah(signal.last_close) : ''}
                  </span>
                  {signal && (
                    <span className={`text-[10px] sm:text-xs font-bold px-2 py-1 rounded-md ${statusBg} whitespace-nowrap`}>
                      Target: {pctString}
                    </span>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 px-1 sm:px-0">

          {/* Full Width Chart Section */}
          <div className="lg:col-span-12 flex flex-col gap-8">
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col h-[400px] sm:h-[500px] lg:h-[600px] 2xl:h-[700px]">
              {/* Chart Header - Restructured for top-alignment */}
              <div className="px-4 sm:px-6 py-4 border-b border-slate-100 flex flex-col gap-3 bg-slate-50/50">
                <div className="flex justify-between items-start sm:items-center gap-4">
                  <div className="flex flex-col">
                    <h2 className="text-sm sm:text-base font-semibold text-slate-800">Forecast Trajectory</h2>
                    <p className="text-[9px] sm:text-[10px] text-slate-400 font-medium line-clamp-1">Predictive visualization of historical and future pricing</p>
                  </div>
                  
                  <div className="flex bg-slate-200/50 p-0.5 sm:p-1 rounded-lg border border-slate-200 shrink-0">
                    {(['1W', '1M', 'ALL'] as ForecastHorizon[]).map(t => (
                      <button
                        key={t}
                        onClick={() => setHorizon(t)}
                        className={`px-2.5 sm:px-4 py-1 sm:py-1.5 text-[10px] sm:text-xs font-bold rounded-md transition-all ${horizon === t ? 'bg-white text-blue-600 shadow-sm border border-slate-200/50' : 'text-slate-500 hover:text-slate-800'}`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Legend moved below title/filters row */}
                <div className="flex flex-wrap items-center gap-x-3 sm:gap-x-4 gap-y-2">
                  {[
                    { label: 'Past Price', color: 'bg-slate-900', type: 'line' },
                    { label: isConfident ? 'Forecast Target' : 'Wait & See', color: !isConfident ? 'bg-slate-400' : (scaled?.returnPct ?? 0) > 0 ? 'bg-emerald-500' : (scaled?.returnPct ?? 0) < 0 ? 'bg-rose-500' : 'bg-blue-600', type: 'dashed' },
                    { label: 'Volume', color: 'bg-slate-300', type: 'bar' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-1.5 shrink-0">
                      <div className={`h-1 rounded-full sm:h-1.5 ${item.color} ${item.type === 'line' ? 'w-3 sm:w-4' : item.type === 'dashed' ? `w-3 sm:w-4 border-t-2 border-dashed ${!isConfident ? 'border-slate-400' : (scaled?.returnPct ?? 0) > 0 ? 'border-emerald-500' : (scaled?.returnPct ?? 0) < 0 ? 'border-rose-500' : 'border-blue-600'} bg-transparent` : item.type === 'area' ? 'w-2.5 h-2.5 sm:w-3 sm:h-3 opacity-60' : 'w-1.5 h-2.5 sm:w-2 sm:h-3'}`} />
                      <span className="text-[9px] sm:text-[10px] font-medium text-slate-500 whitespace-nowrap">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
              {/* Chart Body */}
              <div className="flex-1 p-2 sm:p-6 pb-2 min-h-0">
                <PriceForecastChart 
                  signal={signal} 
                  isLoading={isLoading} 
                  horizon={horizon} 
                  data={chartData}
                  onHover={setHoveredPoint}
                  onMouseOut={() => setHoveredPoint(null)}
                />
              </div>
            </div>

            {/* Metrics & Indicators Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Core Forecast Metrics */}
              <div className="md:col-span-12 lg:col-span-4 space-y-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Forecast Metrics</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
                  {[
                    { label: 'Target Price', val: scaled ? formatRupiah(scaled.predClose) : '-' },
                    { label: 'Min Predicted', val: scaled ? formatRupiah(signal!.last_close * (1 + scaled.rangeMinPct / 100)) : '-' },
                    { label: 'Max Predicted', val: scaled ? formatRupiah(signal!.last_close * (1 + scaled.rangeMaxPct / 100)) : '-' },
                  ].map((m, i) => (
                    <div key={i} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-row justify-between items-center sm:items-start lg:items-center sm:flex-col lg:flex-row gap-2">
                      <p className="text-[10px] sm:text-xs font-medium text-slate-500">{m.label}</p>
                      <p className="text-sm font-semibold text-slate-900">{m.val}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Technical Indicators */}
              <div className="md:col-span-12 lg:col-span-8 space-y-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Key Indicators</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { 
                      label: indicatorStats.volState, 
                      val: indicatorStats.vol, 
                      icon: indicatorStats.volIcon, 
                      bg: indicatorStats.volBg, 
                      fg: indicatorStats.volColor 
                    },
                    { 
                      label: indicatorStats.volatilityLabel, 
                      val: indicatorStats.volatility, 
                      icon: indicatorStats.volatilityIcon, 
                      bg: indicatorStats.volatilityBg, 
                      fg: indicatorStats.volatilityFg 
                    },
                    { 
                      label: indicatorStats.volumeLabel, 
                      val: indicatorStats.volumeTrend, 
                      icon: indicatorStats.volumeIcon, 
                      bg: indicatorStats.volumeBg, 
                      fg: indicatorStats.volumeFg 
                    },
                    { 
                      label: indicatorStats.recLabel, 
                      val: indicatorStats.recommendation, 
                      icon: indicatorStats.recIcon, 
                      bg: indicatorStats.recBg, 
                      fg: indicatorStats.recFg 
                    }
                  ].map((item, i) => (
                    <div key={i} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex items-center gap-4 hover:bg-slate-50 transition-colors">
                      <div className={`w-10 h-10 rounded-md flex items-center justify-center ${item.bg}`}>
                        {item.icon && <item.icon className={`w-5 h-5 ${item.fg}`} />}
                      </div>
                      <div>
                        <p className="text-[10px] sm:text-xs font-medium text-slate-500">{item.label}</p>
                        <p className={`text-xs sm:text-sm font-bold ${item.fg?.includes('amber') && !hoveredPoint ? 'animate-pulse' : ''}`}>
                          {item.val}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>

      </main>
    </div>
  );
}