
import { db } from '@/db';
import { apiData } from '@/db/schema';
import { eq } from 'drizzle-orm';
import type { StockSignal } from '@/lib/types/signal';

const GIBEI_API_URL = process.env.GIBEI_API_URL ?? 'https://gibeiml-apigibei.hf.space';

/** Hitung monthKey untuk ticker tertentu format "TICKER-YYYY-MM" */
function getTickerMonthKey(ticker: string): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${ticker.toUpperCase()}-${year}-${month}`;
}

/**
 * Parser string range "-2.1% to 3.6%" ke min dan max numerik.
 */
function parseRange(rawData: any): { rangeMin: number, rangeMax: number } {
  let rangeMin = rawData.range_min_pct ?? 0;
  let rangeMax = rawData.range_max_pct ?? 0;

  if (rawData.range && typeof rawData.range === 'string') {
    const match = rawData.range.match(/([-+]?[0-9]*\.?[0-9]+)%?.*?to.*?([-+]?[0-9]*\.?[0-9]+)%?/i);
    if (match && match.length >= 3) {
      rangeMin = parseFloat(match[1]);
      rangeMax = parseFloat(match[2]);
    }
  }
  return { rangeMin, rangeMax };
}

/**
 * Ambil sinyal per ticker.
 * Logic:
 * 1. Cek DB untuk cache bulanan ticker tersebut.
 * 2. Fetch realtime /predict/{ticker} selalu untuk harga terbaru.
 * 3. Jika cache ada, gunakan data forecast dari cache tapi harga dari realtime.
 * 4. Jika cache tidak ada, simpan hasil fetch pertama kali ke DB sebagai cache bulan ini.
 */
export async function getSignalByTicker(ticker: string): Promise<StockSignal | null> {
  try {
    const symbol = ticker.toUpperCase();
    const monthKey = getTickerMonthKey(symbol);

    // 1. Cek cache di DB
    const cached = await db.query.apiData.findFirst({
      where: eq(apiData.monthKey, monthKey),
    });

    let forecastData: StockSignal | null = null;
    if (cached) {
      try {
        forecastData = JSON.parse(cached.data) as StockSignal;
      } catch (e) {
        console.error(`[signals] Failed to parse cache for ${monthKey}`, e);
      }
    }

    // 2. Fetch realtime dari API
    console.log(`[predict] Fetching realtime price for ${symbol}...`);
    let realtimeData: any = null;
    try {
      const res = await fetch(`${GIBEI_API_URL}/predict/${symbol}`, {
        next: { revalidate: 0 },
        signal: AbortSignal.timeout(30_000),
      });
      if (res.ok) {
        realtimeData = await res.json();
      } else if (res.status === 404) {
        return null;
      }
    } catch (err) {
      console.warn(`[predict] Realtime fetch for ${symbol} failed/timeout.`, err);
    }

    // Jika tidak ada cache DAN tidak bisa fetch realtime, kita tidak punya data
    if (!forecastData && !realtimeData) {
      return null;
    }

    // 3. Jika ada realtimeData namun belum ada cache, simpan sebagai cache bulan ini
    if (realtimeData && !forecastData) {
      const { rangeMin, rangeMax } = parseRange(realtimeData);
      forecastData = {
        ...realtimeData,
        date: realtimeData.date || new Date().toISOString(),
        range_min_pct: rangeMin,
        range_max_pct: rangeMax,
        historical_dates: realtimeData.historical_dates,
        historical_prices: realtimeData.historical_prices,
        historical_volumes: realtimeData.historical_volumes,
      } as StockSignal;

      console.log(`[signals] Saving new monthly cache for ${monthKey}`);
      await db.insert(apiData).values({
        monthKey: monthKey,
        data: JSON.stringify(forecastData),
      }).onConflictDoUpdate({
        target: apiData.monthKey,
        set: { data: JSON.stringify(forecastData), updatedAt: new Date() }
      });
    }

    // 4. Return data: Forecast dari CACHE (biar konsisten sebulan), Harga & Tanggal dari REALTIME
    const { rangeMin, rangeMax } = parseRange(forecastData);
    return {
      ...forecastData,
      range_min_pct: rangeMin,
      range_max_pct: rangeMax,
      // Overwrite harga & tanggal jika sukses fetch realtime
      date: realtimeData ? (realtimeData.date || new Date().toISOString()) : forecastData!.date,
      last_close: realtimeData ? realtimeData.last_close : forecastData!.last_close,
      volume: realtimeData
        ? (realtimeData.volume ?? (realtimeData.historical_volumes?.length ? realtimeData.historical_volumes[realtimeData.historical_volumes.length - 1] : 0))
        : forecastData!.volume,
      // Always use the latest historical data if available
      historical_dates: realtimeData?.historical_dates || forecastData!.historical_dates,
      historical_prices: realtimeData?.historical_prices || forecastData!.historical_prices,
      historical_volumes: realtimeData?.historical_volumes || forecastData!.historical_volumes,
    } as StockSignal;

  } catch (err) {
    console.error(`[signals] Failed to process ticker ${ticker}:`, err);
    return null;
  }
}

/** 
 * Unused but kept as empty export to prevent breaking imports if any.
 * In a real refactor we should check app code.
 */
export async function getAllSignals(): Promise<StockSignal[]> {
  return [];
}
