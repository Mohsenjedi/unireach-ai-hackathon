export type CountryTier = 1 | 2 | 3;

export interface MarketingPlan {
  tier: CountryTier;
  strategyName: string;
  recommendedChannels: string[];
  contentStyle: string;
  tone: string;
  language: string;
  aiGeneratedAssets?: {
    radioScript?: string;
    embassyLetter?: string;
    schoolEmail?: string;
  };
}

export const getCountryTier = (internetPenetration: number): CountryTier => {
  if (internetPenetration > 60) return 1; // Digital-Ready
  if (internetPenetration >= 30) return 2; // Mixed
  return 3; // Low-Infrastructure
};

export const getBasePlan = (tier: CountryTier, countryName: string): MarketingPlan => {
  const locationHint = `for ${countryName}`;
  switch (tier) {
    case 1:
      return {
        tier: 1,
        strategyName: `Digital Dominance ${locationHint}`,
        recommendedChannels: ["TikTok", "Instagram", "Google Ads", "YouTube"],
        contentStyle: "Short-form video, student vlogs, interactive stories",
        tone: "Energetic, modern, aspirational",
        language: "Local + English",
      };
    case 2:
      return {
        tier: 2,
        strategyName: `Omnichannel Growth ${locationHint}`,
        recommendedChannels: ["WhatsApp Business", "Facebook", "Local SMS", "YouTube"],
        contentStyle: "Testimonials, informational infographics, community groups",
        tone: "Community-focused, trustworthy, helpful",
        language: "Local Primary",
      };
    case 3:
      return {
        tier: 3,
        strategyName: `Grassroots & Traditional ${locationHint}`,
        recommendedChannels: ["Radio", "SMS Broadcast", "Embassy Partnerships", "NGO Networks"],
        contentStyle: "Formal letters, radio spots, physical brochures, SMS short-codes",
        tone: "Formal, respectful, prestige-oriented",
        language: "Official National Language",
      };
  }
};
