'use client';

import { useState, useEffect } from 'react';

interface Props {
  countryId: string;
  countryName?: string;
}

interface Recommendation {
  type: string;
  name: string;
  priority: 'High' | 'Medium' | 'Experimental';
  reason: string;
}

const PRIORITY_COLORS = {
  High: 'bg-green-100 text-green-800',
  Medium: 'bg-yellow-100 text-yellow-800',
  Experimental: 'bg-purple-100 text-purple-800'
};

export default function FairRecommendationPanel({ countryId, countryName }: Props) {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'All' | 'High' | 'Medium' | 'Experimental'>('All');

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`/api/agent2/fairs/${countryId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch recommendations');
        }
        const data = await response.json();
        setRecommendations(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [countryId]);

  const filteredRecommendations = recommendations.filter(rec =>
    filter === 'All' || rec.priority === filter
  );

  if (loading) {
    return (
      <div className="space-y-3">
        <div className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">
          RECOMMENDED OUTREACH
        </div>
        <div className="animate-pulse space-y-2">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-16 bg-gray-200 rounded"></div>
          <div className="h-16 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-3">
        <div className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">
          RECOMMENDED OUTREACH
        </div>
        <div className="border border-red-200 rounded-lg p-4 bg-red-50">
          <p className="text-red-700 text-sm">Could not load recommendations.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">
        Recommended outreach for {countryName ?? 'selected country'}
      </div>

      <div className="flex gap-2 mb-4">
        {(['All', 'High', 'Medium', 'Experimental'] as const).map(priority => (
          <button
            key={priority}
            onClick={() => setFilter(priority)}
            className={`px-3 py-1 text-xs rounded-full transition-colors ${
              filter === priority
                ? 'bg-gray-800 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {priority}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {filteredRecommendations.map((rec, index) => (
          <div key={index} className="bg-gray-50 border border-gray-100 rounded-xl p-3">
            <div className="flex items-start justify-between mb-2">
              <span className="bg-gray-200 text-gray-600 text-xs rounded-full px-2 py-0.5">
                {rec.type}
              </span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${PRIORITY_COLORS[rec.priority]}`}>
                {rec.priority}
              </span>
            </div>
            <h4 className="text-sm font-medium text-gray-900 mb-1">{rec.name}</h4>
            <p className="text-xs text-gray-500">{rec.reason}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
