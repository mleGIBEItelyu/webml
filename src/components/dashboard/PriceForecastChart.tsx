
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

const data = [
  { date: '1 Jul', actual: 9240, forecast: 9240, lower: 9240, upper: 9240 },
  { date: '7 Jul', actual: 9300, forecast: 9310, lower: 9290, upper: 9320 },
  { date: '14 Jul', actual: 9550, forecast: 9500, lower: 9480, upper: 9520 },
  { date: '19 Jul', actual: 9500, forecast: 9510, lower: 9490, upper: 9530 },
  { date: '21 Jul', actual: 9800, forecast: 9750, lower: 9700, upper: 9800 },
  { date: '26 Jul', actual: 9850, forecast: 9850, lower: 9800, upper: 9900 },
  { date: '29 Jul', actual: 9850, forecast: 9850, lower: 9750, upper: 9950 }, // Current
  { date: '23 Apr', actual: null, forecast: 9900, lower: 9800, upper: 10000 },
  { date: '28 Apr', actual: null, forecast: 10100, lower: 9950, upper: 10250 },
  { date: '2 May', actual: null, forecast: 10300, lower: 10100, upper: 10500 },
];

export default function PriceForecastChart() {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Harga Actual vs Forecast</h2>
          <p className="text-sm text-gray-500">Comparison with confidence bands</p>
        </div>

        {/* Custom Legend */}
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-blue-600"></span>
            <span className="text-gray-600 font-medium">Actual</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-orange-500"></span>
            <span className="text-gray-600 font-medium">Forecast</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-gray-200"></span>
            <span className="text-gray-400 font-medium">Band</span>
          </div>
        </div>
      </div>

      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorBand" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f3f4f6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#f3f4f6" stopOpacity={0}/>
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
              domain={[9200, 10800]} 
              tickFormatter={(value) => `${(value / 1000).toFixed(1)}k`}
            />

            <Tooltip 
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />

            {/* Confidence Band Area */}
            {/* We simulate band using stacked area or just Area with range if supported, 
                but simple Area covering upper bound is easier for mock if we don't strictly need precise range shading in simple recharts without custom shape.
                Better approach for band: Two areas, one white to hide bottom, one colored. Or creating a [lower, upper] range dataKey if using Recharts newer versions. 
                For simplicity in standard Recharts, we can't easily do a floating band without a "range" area which is supported in Area as [min, max].
            */}
            <Area
              type="monotone"
              dataKey="upper"
              stroke="none"
              fill="#f8fafc" // Very light gray/blue
              connectNulls
            />
            {/* Hack to hide area below 'lower' - overlay with white? No, that hides grid. 
                Recharts Area `dataKey` can take a function or array `[min, max]` in newer versions. 
                Let's try the array syntax which works in newer Recharts.
            */}
            <Area
              type="monotone"
              dataKey={(item) => [item.lower, item.upper]}
              stroke="none"
              fill="#f1f5f9"
              connectNulls
            />

            {/* Actual Line (Blue Solid) */}
            <Line
              type="monotone"
              dataKey="actual"
              stroke="#2563eb" // Blue-600
              strokeWidth={3}
              dot={false}
              connectNulls={false}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />

            {/* Forecast Line (Orange Dashed) */}
            <Line
              type="monotone"
              dataKey="forecast"
              stroke="#f97316" // Orange-500
              strokeWidth={3}
              strokeDasharray="5 5"
              dot={false}
              connectNulls
            />

            {/* "Current" Reference Line */}
            <ReferenceLine x="29 Jul" stroke="#9ca3af" strokeDasharray="3 3" label={{ value: 'Current', position: 'insideBottom', fill: '#9ca3af', fontSize: 12, dy: 20 }} />

          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
