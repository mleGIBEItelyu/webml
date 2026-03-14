import type { StockSignal } from '../types/signal';

export type ForecastHorizon = '1D' | '1W' | '1M';

export interface ScaledForecast {
  returnPct: number;
  predClose: number;
  rangeMinPct: number;
  rangeMaxPct: number;
  label: string;
}

export function scaleForecast(signal: StockSignal | null, horizon: ForecastHorizon): ScaledForecast | null {
  if (!signal) return null;

  // Baseline is 1W (7 Days)
  const baseReturn = signal.return_7d_pct;
  const baseMin = signal.range_min_pct ?? 0;
  const baseMax = signal.range_max_pct ?? 0;
  
  let factor = 1;
  let label = '+7D Forecast';

  if (horizon === '1D') {
    factor = 1 / 7;
    label = '+1D Forecast';
  } else if (horizon === '1M') {
    factor = 30 / 7;
    label = '+30D Forecast';
  }

  const scaledReturn = baseReturn * factor;
  const scaledMin = baseMin * factor;
  const scaledMax = baseMax * factor;
  const scaledPredClose = signal.last_close * (1 + (scaledReturn / 100));

  return {
    returnPct: scaledReturn,
    predClose: scaledPredClose,
    rangeMinPct: scaledMin,
    rangeMaxPct: scaledMax,
    label
  };
}
