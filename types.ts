
export enum AQILevel {
  GOOD = 'Good',
  MODERATE = 'Moderate',
  POOR = 'Poor',
  SEVERE = 'Severe',
  HAZARDOUS = 'Hazardous'
}

export type DashboardTheme = 'dark' | 'light';

export type AppView = 'home' | 'rankings' | 'analytics' | 'health' | 'methodology' | 'zone' | 'scan' | 'enforcement' | 'pulse' | 'forecast' | 'governance';

export interface Policy {
  id: string;
  label: string;
  impact: number; // Percentage reduction (e.g., 0.15 for 15%)
  active: boolean;
  description: string;
}

export interface Station {
  uid: number;
  lat: number;
  lon: number;
  aqi: number;
  stationName: string;
}

export interface AtmosphericPrediction {
  hours: number;
  aqi: number;
  primaryPollutant: string;
  riskLevel: RiskLevel;
  confidence: number;
  explanation: string;
}

export interface SourceAttribution {
  dominantSource: {
    label: string;
    type: 'vehicular' | 'industrial' | 'construction' | 'biomass' | 'regional';
    confidence: number;
  };
  secondarySources: { label: string; weight: number }[];
  reasoning: string[];
  socialSnippet: string;
  confidenceScore: number;
}

export interface PollutionPost {
  id: string;
  user: {
    name: string;
    handle: string;
    avatar?: string;
    isVerified: boolean;
  };
  ward: {
    id: string;
    name: string;
    aqi: number;
  };
  content: string;
  media?: string;
  timestamp: string;
  stats: {
    upvotes: number;
    comments: number;
    shares: number;
  };
  aiConfidence: 'High' | 'Medium' | 'Low';
  status: 'Reported' | 'Acknowledged' | 'Resolved';
}

export interface Ward {
  id: string;
  name: string;
  no: number;
  aqi: number;
  status: AQILevel;
  zone: string;
  region: string;
  primarySource: string;
  nearestStation?: string;
  lastUpdated: string;
  coordinates: { lat: number; lng: number };
  pollutants: {
    pm25: number;
    pm10: number;
    no2: number;
    so2: number;
    co: number;
  };
  windSpeed: number;
  humidity: number;
  breakdown: {
    transport: number;
    construction: number;
    industry: number;
    waste: number;
  };
  history: {
    hourly: { time: string; aqi: number }[];
    daily: { time: string; aqi: number }[];
    monthly: { time: string; aqi: number }[];
  };
  geoJson?: any;
  nearestSensor?: string;
  sensorDistance?: string;
}

export interface MitigationPlan {
  summary: string;
  steps: string[];
  priority: 'High' | 'Medium' | 'Low';
}

export interface GroundingChunk {
  web?: { uri: string; title: string };
  maps?: { uri: string; title: string };
}

export type RiskLevel = 'Extreme' | 'High' | 'Medium' | 'Low';

export interface RegionSummary {
  name: string;
  avgAqi: number;
  risk: RiskLevel;
  cause: string;
  nodeCount: number;
}

export interface Factory {
  id: string;
  name: string;
  zone: string;
  compliance: 'Active' | 'Non-Compliant' | 'Suspended' | 'Under-Review';
  emissions: string;
  lastInspection: string;
  violationCount: number;
}
