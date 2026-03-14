/**
 * Shape of a single stock signal returned by the HuggingFace API.
 * Endpoint: GET /predict/{ticker}  or item inside GET /signals
 */
export interface StockSignal {
  ticker: string;
  date: string;           // "YYYY-MM-DD"
  last_close: number;     // last closing price (IDR)
  pred_7d_close: number;  // predicted close 7 days from now
  return_7d_pct: number;  // expected % return over 7 days
  range_min_pct: number;  // lower bound of predicted return range
  range_max_pct: number;  // upper bound of predicted return range
  signal: 'BUY' | 'SELL' | 'WAIT&SEE';
  confidence: number;     // 0–100
  volume?: number;        // dynamic metrics
  volatility?: string;
  risk_level?: string;
}

export type SignalType = StockSignal['signal'];
