'use client';

import { TrendingUp, TrendingDown, Minus, Zap } from 'lucide-react';
import type { StockSignal } from '@/lib/types/signal';
import { scaleForecast, type ForecastHorizon } from '@/lib/utils/forecast';

interface DashboardMetricsProps {
  query: string;
  signal: StockSignal | null;
  isLoading: boolean;
  horizon: ForecastHorizon;
}

// ─── helpers ────────────────────────────────────────────────────────────────

function formatRupiah(value: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value);
}

// Skeleton declared OUTSIDE render to avoid react-hooks/static-components error
function Skeleton({ className }: { className: string }) {
  return <div className={`animate-pulse bg-slate-200 rounded-lg ${className}`} />;
}

function SignalBadge({ signal, label }: { signal: StockSignal['signal'], label: string }) {
  if (signal === 'BUY') {
    return (
      <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full font-bold text-sm">
        <TrendingUp className="w-4 h-4" />
        <span>{label}</span>
      </div>
    );
  }
  if (signal === 'SELL') {
    return (
      <div className="flex items-center gap-1 text-red-500 bg-red-50 px-3 py-1.5 rounded-full font-bold text-sm">
        <TrendingDown className="w-4 h-4" />
        <span>{label}</span>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-1 text-amber-600 bg-amber-50 px-3 py-1.5 rounded-full font-bold text-sm">
      <Minus className="w-4 h-4" />
      <span>{label}</span>
    </div>
  );
}

function signalLabel(s: StockSignal['signal'] | undefined): string {
  if (!s) return '—';
  if (s === 'WAIT&SEE') return 'WAIT & SEE';
  return s;
}

function signalColor(s: StockSignal['signal'] | undefined): string {
  if (s === 'BUY') return 'text-emerald-600';
  if (s === 'SELL') return 'text-red-500';
  return 'text-amber-600';
}

function confidenceBarColor(s: StockSignal['signal'] | undefined): string {
  if (s === 'BUY') return 'from-emerald-600 to-emerald-400';
  if (s === 'SELL') return 'from-red-600 to-red-400';
  return 'from-amber-500 to-amber-300';
}

/** Format date string from signal or fallback to current datetime. No useState needed. */
function formatLastUpdated(signal: StockSignal | null): string {
  if (signal?.date) {
    return new Date(signal.date).toLocaleDateString('id-ID', {
      day: 'numeric', month: 'short', year: 'numeric',
    });
  }
  return new Date().toLocaleString('en-US', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: false,
    timeZone: 'Asia/Jakarta',
  });
}

// ─── component ───────────────────────────────────────────────────────────────

export default function DashboardMetrics({ query, signal, isLoading, horizon }: DashboardMetricsProps) {
  const scaled = scaleForecast(signal, horizon);
  const returnPct = scaled?.returnPct ?? 0;
  const retStr = `${returnPct >= 0 ? '+' : ''}${returnPct.toFixed(2)}% (${horizon})`;
  const confidence = signal?.confidence ?? 0;
  const lastUpdated = formatLastUpdated(signal);

  return (
    <div className="bg-white rounded-4xl p-6 sm:p-8 shadow-[0_2px_40px_-12px_rgba(0,0,0,0.08)] border border-slate-100 mb-6 animate-in fade-in duration-700">
      <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-6">
        
        {/* Left: Identity & Price */}
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="bg-slate-900 text-white px-3 py-1 rounded-lg text-sm font-bold">{query}</span>
            {isLoading ? (
              <Skeleton className="h-4 w-40" />
            ) : (
              <span className="text-slate-500 text-sm font-medium">
                {signal ? `Sinyal per ${signal.date}` : 'Data tidak tersedia'}
              </span>
            )}
          </div>
          <div className="flex items-baseline gap-4 mt-1">
            {isLoading ? (
              <Skeleton className="h-12 w-48" />
            ) : (
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900">
                {signal ? formatRupiah(signal.last_close) : '—'}
              </h1>
            )}
            {!isLoading && signal && scaled && (
              <SignalBadge signal={signal.signal} label={scaled.label} />
            )}
            {!isLoading && signal && (
              <span className={`font-bold text-sm ${returnPct >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                {retStr}
              </span>
            )}
          </div>
          <p className="text-slate-400 text-sm mt-2">
            {isLoading
              ? 'Loading...'
              : `Data: ${lastUpdated} · Pred. ${horizon}: ${scaled ? formatRupiah(scaled.predClose) : '—'}`
            }
          </p>
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
              {isLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-7 w-32" />
                  <Skeleton className="h-2 w-full" />
                  <Skeleton className="h-3 w-3/4" />
                </div>
              ) : (
                <div className="flex items-center justify-between mb-3">
                  <h2 className={`text-xl font-black italic ${signalColor(signal?.signal)}`}>
                    {signalLabel(signal?.signal)}
                  </h2>
                  <span className="text-xs font-bold text-slate-500 bg-white px-2 py-0.5 rounded-lg border border-slate-100 shadow-sm">
                    {confidence.toFixed(0)}% Conf.
                  </span>
                </div>
              )}
              {!isLoading && signal && scaled && (
                <div className="space-y-2">
                  <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-linear-to-r ${confidenceBarColor(signal.signal)} rounded-full transition-all duration-700`}
                      style={{ width: `${confidence}%` }}
                    />
                  </div>
                  <p className="text-[11px] leading-relaxed text-slate-500 font-medium">
                    Range prediksi:{' '}
                    <span className="font-bold text-slate-700">
                      {scaled.rangeMinPct >= 0 ? '+' : ''}{scaled.rangeMinPct.toFixed(1)}%
                    </span>
                    {' '}hingga{' '}
                    <span className="font-bold text-slate-700">
                      {scaled.rangeMaxPct >= 0 ? '+' : ''}{scaled.rangeMaxPct.toFixed(1)}%
                    </span>
                    {' '}dalam <span className="text-red-600 font-bold">{horizon}</span>.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
