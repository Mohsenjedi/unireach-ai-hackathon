'use client';

import { useState, useEffect } from 'react';

interface CallbackData {
  housing: number;
  visa: number;
  tuition: number;
  competitor: number;
}

const COLORS = {
  housing: '#6366f1',
  visa: '#f59e0b',
  tuition: '#10b981',
  competitor: '#f43f5e'
};

const LABELS = {
  housing: 'Housing',
  visa: 'Visa Process',
  tuition: 'Tuition Costs',
  competitor: 'Competitor Comparison'
};

export default function CallbackInsightsPanel() {
  const [data, setData] = useState<CallbackData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('/api/admin/callback-insights');
        if (!response.ok) {
          throw new Error('Failed to fetch callback insights');
        }
        const insights = await response.json();
        setData(insights);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchInsights();
  }, []);

  const calculateSlices = (data: CallbackData) => {
    const total = Object.values(data).reduce((sum, value) => sum + value, 0);
    const other = Math.max(0, 100 - total);

    let cumulativeAngle = 0;
    const slices = Object.entries(data).map(([key, value]) => {
      const percentage = (value / total) * 100;
      const startAngle = cumulativeAngle;
      const endAngle = cumulativeAngle + (percentage / 100) * 360;
      cumulativeAngle = endAngle;

      return {
        key,
        percentage,
        startAngle,
        endAngle,
        color: COLORS[key as keyof typeof COLORS]
      };
    });

    if (other > 0) {
      slices.push({
        key: 'other',
        percentage: other,
        startAngle: cumulativeAngle,
        endAngle: cumulativeAngle + (other / 100) * 360,
        color: '#e5e7eb'
      });
    }

    return slices;
  };

  const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    };
  };

  const describeArc = (x: number, y: number, radius: number, startAngle: number, endAngle: number) => {
    const start = polarToCartesian(x, y, radius, endAngle);
    const end = polarToCartesian(x, y, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    const d = [
      "M", start.x, start.y,
      "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
    ].join(" ");
    return d;
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-gray-900">Applicant hesitation insights from conversational interactions</h3>
        <div className="animate-pulse">
          <div className="w-48 h-48 bg-gray-200 rounded-full mx-auto"></div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-gray-900">Applicant hesitation insights from conversational interactions</h3>
        <div className="border border-red-200 rounded-lg p-4 bg-red-50">
          <p className="text-red-700 text-sm">Could not load callback insights.</p>
        </div>
      </div>
    );
  }

  const slices = calculateSlices(data);

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-gray-900">Applicant hesitation insights from conversational interactions</h3>

      <div className="flex flex-col items-center">
        <svg width="200" height="200" className="mb-4">
          {slices.map((slice) => (
            <path
              key={slice.key}
              d={describeArc(100, 100, 80, slice.startAngle, slice.endAngle)}
              fill={slice.color}
              stroke="white"
              strokeWidth="2"
            />
          ))}
        </svg>

        <div className="grid grid-cols-2 gap-4 w-full max-w-xs">
          {Object.entries(data).map(([key, value]) => (
            <div key={key} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: COLORS[key as keyof typeof COLORS] }}
              />
              <div>
                <div className="text-xs font-medium text-gray-900">{LABELS[key as keyof typeof LABELS]}</div>
                <div className="text-xs text-gray-500">{value}%</div>
              </div>
            </div>
          ))}
          {slices.find(s => s.key === 'other') && (
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full flex-shrink-0 bg-gray-300" />
              <div>
                <div className="text-xs font-medium text-gray-900">Other</div>
                <div className="text-xs text-gray-500">{slices.find(s => s.key === 'other')?.percentage.toFixed(1)}%</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
