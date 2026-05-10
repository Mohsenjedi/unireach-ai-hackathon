'use client';

import React, { createContext, useContext, useState } from 'react';

type AgentInsight = {
  source: 'MarketIntelligence' | 'MarketingStrategy' | 'LeadRouting' | 'AdmissionsChatbot';
  type: 'MARKET_RECOMMENDATION' | 'CAMPAIGN_LAUNCH' | 'PRIORITY_LEAD' | 'DEMAND_SIGNAL';
  payload: Record<string, unknown>;
  timestamp: Date;
};

interface AgentCommunicationContextType {
  insights: AgentInsight[];
  publishInsight: (insight: Omit<AgentInsight, 'timestamp'>) => void;
  clearInsights: () => void;
}

const AgentCommunicationContext = createContext<AgentCommunicationContextType | undefined>(undefined);

export function AgentCommunicationProvider({ children }: { children: React.ReactNode }) {
  const [insights, setInsights] = useState<AgentInsight[]>([]);

  const publishInsight = (insight: Omit<AgentInsight, 'timestamp'>) => {
    const newInsight = { ...insight, timestamp: new Date() };
    setInsights(prev => [newInsight, ...prev].slice(0, 10)); // Keep last 10
    
  };

  const clearInsights = () => setInsights([]);

  return (
    <AgentCommunicationContext.Provider value={{ insights, publishInsight, clearInsights }}>
      {children}
    </AgentCommunicationContext.Provider>
  );
}

export function useAgentCommunication() {
  const context = useContext(AgentCommunicationContext);
  if (!context) {
    throw new Error('useAgentCommunication must be used within an AgentCommunicationProvider');
  }
  return context;
}
