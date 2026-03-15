
import { NextResponse } from 'next/server';
import { getSignalByTicker } from '@/lib/api-data-service';

export const dynamic = 'force-dynamic';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ ticker: string }> }
) {
  const { ticker } = await params;

  if (!ticker || ticker.length > 6) {
    return NextResponse.json({ error: 'Invalid ticker' }, { status: 400 });
  }

  try {
    const signal = await getSignalByTicker(ticker);
    if (!signal) {
      return NextResponse.json(
        { error: `No signal found for ticker: ${ticker.toUpperCase()}` },
        { status: 404 }
      );
    }
    return NextResponse.json(signal);
  } catch (err) {
    console.error(`[API /signals/${ticker}]`, err);
    return NextResponse.json(
      { error: 'Failed to fetch signal. The ML server may be warming up, please retry.' },
      { status: 503 }
    );
  }
}
