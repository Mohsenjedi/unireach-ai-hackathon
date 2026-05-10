export interface CountryData {
  id: string;
  name: string;
  gdpPerCapita: number;
  internetUsers: number;
  mobileSubs: number;
  youthPop: number; // 15-24 proxy or specific
  youthUnemployment: number;
  educationExp: number;
  englishProficiency: number; // 0-100 scale
  outboundMobility: number; // Ratio
}

export interface ScoredCountry extends CountryData {
  score: number;
  rank: number;
}

export const fetchWorldBankData = async (_countryCode: string) => {
  void _countryCode;
  // In a real app, this would fetch from WB API.
  // For the hackathon, we'll implement a function that fetches multiple indicators.
  // Example URL: https://api.worldbank.org/v2/country/IN/indicator/NY.GDP.PCAP.CD?format=json&date=2023
  
  // Mocking the fetch for now to ensure stability, but plan to implement live fetch if requested.
  return {
    gdpPerCapita: Math.random() * 50000,
    internetUsers: Math.random() * 100,
    mobileSubs: Math.random() * 150,
    youthPop: Math.random() * 1000000,
    youthUnemployment: Math.random() * 30,
    educationExp: Math.random() * 10,
  };
};

export const calculateScore = (data: CountryData, weights: Record<string, number>) => {
  const normalizedGdp = Math.min(data.gdpPerCapita / 60000, 1);
  const normalizedInternet = data.internetUsers / 100;
  const normalizedEnglish = data.englishProficiency / 100;
  const normalizedUnemployment = data.youthUnemployment / 50; // Higher might be better for "push" factor
  
  const score = 
    (normalizedGdp * weights.gdp) +
    (normalizedInternet * weights.internet) +
    (normalizedEnglish * weights.english) +
    (normalizedUnemployment * weights.unemployment) +
    (data.outboundMobility * weights.mobility);
    
  return Math.round(score * 100);
};

export const MAJOR_WEIGHTS: Record<string, Record<string, number>> = {
  "Information Technology": {
    gdp: 0.2,
    internet: 0.3,
    english: 0.2,
    unemployment: 0.1,
    mobility: 0.2
  },
  "Nursing": {
    gdp: 0.4,
    internet: 0.1,
    english: 0.2,
    unemployment: 0.1,
    mobility: 0.2
  },
  "International Business": {
    gdp: 0.3,
    internet: 0.2,
    english: 0.2,
    unemployment: 0.1,
    mobility: 0.2
  },
  "Mechanical Engineering": {
    gdp: 0.25,
    internet: 0.15,
    english: 0.2,
    unemployment: 0.15,
    mobility: 0.25
  },
  "Experience Design": {
    gdp: 0.2,
    internet: 0.2,
    english: 0.3,
    unemployment: 0.1,
    mobility: 0.2
  },
  "Maritime Management": {
    gdp: 0.3,
    internet: 0.1,
    english: 0.3,
    unemployment: 0.1,
    mobility: 0.2
  },
  "Tourism": {
    gdp: 0.25,
    internet: 0.2,
    english: 0.25,
    unemployment: 0.1,
    mobility: 0.2
  }
};
