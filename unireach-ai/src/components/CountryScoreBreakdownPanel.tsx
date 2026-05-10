'use client';

import { useState, useEffect } from 'react';

interface Props {
  countryId: string | null;
  open: boolean;
  onClose: () => void;
}

interface CountryData {
  country: string;
  score: number;
  major: string;
  factors: Record<string, number>;
}

type BreakdownKey = 'economy' | 'education' | 'language' | 'demand' | 'competition';

const FACTOR_LABELS: Record<BreakdownKey, string> = {
  economy: 'Economic Strength',
  education: 'Education Quality',
  language: 'English Proficiency',
  demand: 'Job Market Demand',
  competition: 'Competition Level'
};

const FACTOR_META: Record<BreakdownKey, { phrase: string }> = {
  economy: { phrase: 'economic strength' },
  education: { phrase: 'education quality' },
  language: { phrase: 'English proficiency' },
  demand: { phrase: 'job market demand' },
  competition: { phrase: 'low competition' }
};

export default function CountryScoreBreakdownPanel({ countryId, open, onClose }: Props) {
  const [data, setData] = useState<CountryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open || !countryId) {
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`/api/agent1/score/${countryId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch country data');
        }
        const countryData = await response.json();
        setData({
          country: countryData.country,
          score: countryData.total_score,
          major: countryData.major,
          factors: countryData.breakdown,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [countryId, open]);

  if (!open || !countryId) return null;

  const getTopFactors = (factors: Record<string, number>) =>
    Object.entries(factors)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 2)
      .map(([key]) => FACTOR_META[key as BreakdownKey].phrase);

  const explanation = data ? `${data.country} ranks high for ${data.major} because of ${getTopFactors(data.factors).join(' and ')}.` : '';

  if (loading) {
    return (
      <div className="space-y-3">
        <div className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">
          COUNTRY BREAKDOWN
        </div>
        <div className="animate-pulse space-y-2">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-16 bg-gray-200 rounded"></div>
          <div className="h-16 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="space-y-3">
        <div className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">
          COUNTRY BREAKDOWN
        </div>
        <div className="border border-red-200 rounded-lg p-4 bg-red-50">
          <p className="text-red-700 text-sm">Could not load country breakdown.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">
        <span>COUNTRY BREAKDOWN</span>
        <button type="button" onClick={onClose} className="text-blue-600 hover:text-blue-800 text-xs">
          Close
        </button>
      </div>

      <div className="bg-white border border-gray-100 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-gray-900">{data.country}</h3>
          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
            Score: {data.score}/100
          </span>
        </div>

        <div className="space-y-2 mb-4">
          {Object.entries(data.factors).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <span className="text-xs text-gray-600">{FACTOR_LABELS[key as BreakdownKey]}</span>
              <div className="flex items-center gap-2">
                <div className="w-16 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${value}%` }}
                  />
                </div>
                <span className="text-xs text-gray-500 w-8 text-right">{value}%</span>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-xs text-gray-600">{explanation}</p>
        </div>
      </div>
    </div>
  );
}