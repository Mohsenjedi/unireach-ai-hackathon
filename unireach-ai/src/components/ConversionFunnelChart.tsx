'use client';

import { useState, useEffect } from 'react';

interface FunnelData {
  stage: string;
  count: number;
  percentage: number;
}

export default function ConversionFunnelChart() {
  const [data, setData] = useState<FunnelData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('/api/admin/funnel-metrics');
        if (!response.ok) {
          throw new Error('Failed to fetch funnel metrics');
        }
        const funnelData = await response.json();
        setData(funnelData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-gray-900">Conversion funnel metrics</h3>
        <div className="animate-pulse">
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !data.length) {
    return (
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-gray-900">Conversion funnel metrics</h3>
        <div className="border border-red-200 rounded-lg p-4 bg-red-50">
          <p className="text-red-700 text-sm">Could not load funnel metrics.</p>
        </div>
      </div>
    );
  }

  const maxCount = Math.max(...data.map(d => d.count));
  const funnelHeight = 200;
  const funnelWidth = 300;

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-gray-900">Conversion funnel metrics</h3>

      <div className="flex justify-center">
        <svg width={funnelWidth} height={funnelHeight} className="overflow-visible">
          {data.map((stage, index) => {
            const y = (index / data.length) * funnelHeight;
            const height = funnelHeight / data.length;
            const width = ((stage.count / maxCount) * funnelWidth) + 40;
            const x = (funnelWidth - width) / 2;

            return (
              <g key={index}>
                <polygon
                  points={`${x},${y} ${x + width},${y} ${x + width - 20},${y + height} ${x + 20},${y + height}`}
                  fill="#6366f1"
                  fillOpacity="0.1"
                  stroke="#6366f1"
                  strokeWidth="2"
                />
                <text
                  x={x + width / 2}
                  y={y + height / 2 + 4}
                  textAnchor="middle"
                  className="text-xs font-medium fill-gray-900"
                >
                  {stage.stage}
                </text>
                <text
                  x={x + width + 10}
                  y={y + height / 2 + 4}
                  className="text-xs fill-gray-500"
                >
                  {stage.count} ({stage.percentage}%)
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}