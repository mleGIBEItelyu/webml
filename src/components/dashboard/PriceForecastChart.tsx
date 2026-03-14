
'use client';

import {
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import type { ValueType, NameType } from 'recharts/types/component/DefaultTooltipContent';
import type { StockSignal } from '@/lib/types/signal';
import { scaleForecast, type ForecastHorizon } from '@/lib/utils/forecast';

interface PriceForecastChartProps {
  signal: StockSignal | null;
  isLoading: boolean;
  horizon: ForecastHorizon;
}

interface ChartPoint {
  date: string;
  actual: number | null;
  forecast: number | null;
  lower: number | null;
  upper: number | null;
  isForecast?: boolean;
}

function buildChartData(signal: StockSignal, horizon: ForecastHorizon): ChartPoint[] {
  const scaled = scaleForecast(signal, horizon);
  if (!scaled) return [];

  const lastClose = signal.last_close;
  const pred = scaled.predClose;
  const lowMult = 1 + scaled.rangeMinPct / 100;
  const highMult = 1 + scaled.rangeMaxPct / 100;

  // Titik hari ini
  const today: ChartPoint = {
    date: 'Hari Ini',
    actual: lastClose,
    forecast: lastClose,
    lower: lastClose,
    upper: lastClose,
    isForecast: false,
  };

  // Titik proyeksi berdasarkan horizon
  const horizonLabel = horizon === '1D' ? '+1 Hari' : horizon === '1M' ? '+30 Hari' : '+7 Hari';
  const forecast: ChartPoint = {
    date: horizonLabel,
    actual: null,
    forecast: pred,
    lower: lastClose * lowMult,
    upper: lastClose * highMult,
    isForecast: true,
  };

  return [today, forecast];
}

interface TooltipEntry {
  name?: NameType;
  value?: ValueType;
  color?: string;
}

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: TooltipEntry[]; label?: string }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-100 p-3 text-xs space-y-1 min-w-[160px]">
      <p className="font-bold text-slate-700 mb-2">{label}</p>
      {payload.map((p, i) => {
        if (p.value == null) return null;
        const name = String(p.name ?? '');
        const color = name === 'actual' ? '#2563eb' : name === 'forecast' ? '#f97316' : '#94a3b8';
        const displayLabel = name === 'actual' ? 'Harga Aktual' : name === 'forecast' ? 'Prediksi' : name === 'upper' ? 'Batas Atas' : 'Batas Bawah';
        return (
          <div key={i} className="flex justify-between gap-4">
            <span style={{ color }} className="font-medium">{displayLabel}</span>
            <span className="font-bold text-slate-900">
              {new Intl.NumberFormat('id-ID').format(Math.round(Number(p.value)))}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default function PriceForecastChart({ signal, isLoading, horizon }: PriceForecastChartProps) {
  if (isLoading) {
    return (
      <div className="h-full w-full min-h-[300px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-slate-200 border-t-red-500 rounded-full animate-spin" />
          <p className="text-sm text-slate-400 font-medium">Memuat data prediksi...</p>
        </div>
      </div>
    );
  }

  if (!signal) {
    return (
      <div className="h-full w-full min-h-[300px] flex items-center justify-center">
        <p className="text-sm text-slate-400 font-medium">Data tidak tersedia untuk ticker ini.</p>
      </div>
    );
  }

  const data = buildChartData(signal, horizon);
  const scaled = scaleForecast(signal, horizon);
  
  let minVal = 0;
  let maxVal = 0;
  
  if (scaled) {
    const allValues = [
      signal.last_close, 
      scaled.predClose, 
      signal.last_close * (1 + scaled.rangeMinPct / 100), 
      signal.last_close * (1 + scaled.rangeMaxPct / 100)
    ];
    minVal = Math.min(...allValues) * 0.98;
    maxVal = Math.max(...allValues) * 1.02;
  }

  const tickFormatter = (v: number) => {
    if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
    if (v >= 1_000) return `${(v / 1_000).toFixed(0)}k`;
    return String(v);
  };

  return (
    <div className="h-full w-full min-h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
          <defs>
            <linearGradient id="colorBand" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f0fdf4" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#f0fdf4" stopOpacity={0}/>
            </linearGradient>
          </defs>
          
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
          
          <XAxis 
            dataKey="date" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#9ca3af', fontSize: 12 }} 
            dy={10}
          />
          
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#9ca3af', fontSize: 12 }} 
            domain={[minVal, maxVal]}
            tickFormatter={tickFormatter}
          />

          <Tooltip content={<CustomTooltip />} />

          {/* Confidence Band (upper) */}
          <Area
            type="monotone"
            dataKey="upper"
            stroke="none"
            fill="url(#colorBand)"
            fillOpacity={1}
            connectNulls
          />
          {/* Lower bound (renders as baseline of band) */}
          <Area
            type="monotone"
            dataKey="lower"
            stroke="none"
            fill="#ffffff"
            connectNulls
          />

          {/* Actual price (Blue Solid) */}
          <Line
            type="monotone"
            dataKey="actual"
            stroke="#2563eb"
            strokeWidth={3}
            dot={{ r: 6, fill: '#2563eb', strokeWidth: 0 }}
            activeDot={{ r: 8, strokeWidth: 0 }}
            connectNulls={false}
          />

          {/* Forecast (Orange Dashed) */}
          <Line
            type="monotone"
            dataKey="forecast"
            stroke="#f97316"
            strokeWidth={3}
            strokeDasharray="6 4"
            dot={{ r: 6, fill: '#f97316', strokeWidth: 0 }}
            activeDot={{ r: 8, strokeWidth: 0 }}
            connectNulls
          />

          <ReferenceLine
            x="Hari Ini"
            stroke="#cbd5e1"
            strokeDasharray="3 3"
            label={{ value: 'Sekarang', position: 'insideBottomLeft', fill: '#94a3b8', fontSize: 11, dy: 14 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
