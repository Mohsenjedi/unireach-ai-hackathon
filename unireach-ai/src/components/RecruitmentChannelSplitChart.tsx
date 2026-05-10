'use client';

import { useState, useEffect } from 'react';

interface ChannelData {
  channel: string;
  applications: number;
  conversions: number;
}

const COLORS = {
  applications: '#6366f1',
  conversions: '#10b981'
};

export default function RecruitmentChannelSplitChart() {
  const [data, setData] = useState<ChannelData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('/api/admin/recruitment-channel-split');
        if (!response.ok) {
          throw new Error('Failed to fetch recruitment channel data');
        }
        const channelData = await response.json();
        setData(channelData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const maxApplications = Math.max(...data.map(d => d.applications));
  const maxConversions = Math.max(...data.map(d => d.conversions));

  if (loading) {
    return (
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-gray-900">Recruitment channel performance</h3>
        <div className="animate-pulse space-y-3">
          <div className="h-6 bg-gray-200 rounded"></div>
          <div className="h-6 bg-gray-200 rounded"></div>
          <div className="h-6 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !data.length) {
    return (
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-gray-900">Recruitment channel performance</h3>
        <div className="border border-red-200 rounded-lg p-4 bg-red-50">
          <p className="text-red-700 text-sm">Could not load recruitment channel data.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-gray-900">Recruitment channel performance</h3>

      <div className="space-y-3">
        {data.map((channel, index) => (
          <div key={index} className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-900">{channel.channel}</span>
              <div className="flex gap-4 text-xs text-gray-500">
                <span>{channel.applications} apps</span>
                <span>{channel.conversions} conv</span>
              </div>
            </div>

            <div className="relative">
              <div className="flex h-4 bg-gray-100 rounded overflow-hidden">
                <div
                  className="h-full"
                  style={{
                    width: `${(channel.applications / maxApplications) * 100}%`,
                    backgroundColor: COLORS.applications
                  }}
                />
                <div
                  className="h-full"
                  style={{
                    width: `${(channel.conversions / maxConversions) * 100}%`,
                    backgroundColor: COLORS.conversions
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-4 justify-center">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded" style={{ backgroundColor: COLORS.applications }} />
          <span className="text-xs text-gray-600">Applications</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded" style={{ backgroundColor: COLORS.conversions }} />
          <span className="text-xs text-gray-600">Conversions</span>
        </div>
      </div>
    </div>
  );
}