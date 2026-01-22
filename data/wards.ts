
import { Ward, AQILevel } from '../types';

// In a real production app, this would be fetched from a server-side indexed DB 
// or a highly optimized JSON file. Here we represent the structure for 250 wards.

const generateHistory = (count: number, base: number) => {
  return Array.from({ length: count }).map((_, i) => ({
    time: `${i}:00`,
    aqi: Math.max(0, base + Math.floor(Math.random() * 80 - 40))
  }));
};

export const DELHI_WARDS: Ward[] = [
  {
    id: '1',
    no: 1, // Added missing 'no' property
    name: 'Narela',
    zone: 'Narela Zone',
    // Added missing 'region' property to satisfy the Ward interface
    region: 'North',
    aqi: 342,
    status: AQILevel.SEVERE,
    primarySource: 'Industrial & Biomass Burning',
    nearestSensor: 'CPCB - Narela Station',
    sensorDistance: '1.2km',
    windSpeed: 4.2,
    humidity: 58,
    lastUpdated: '2:45 PM',
    coordinates: { lat: 28.8520, lng: 77.0940 },
    pollutants: { pm25: 290, pm10: 410, no2: 65, so2: 18, co: 3.2 },
    breakdown: { transport: 20, construction: 15, industry: 45, waste: 20 },
    history: {
      hourly: generateHistory(24, 342),
      daily: generateHistory(7, 310),
      monthly: generateHistory(30, 280)
    }
  },
  {
    id: '13',
    no: 13, // Added missing 'no' property
    name: 'Anand Vihar',
    zone: 'Shahdara Zone',
    // Added missing 'region' property to satisfy the Ward interface
    region: 'East',
    aqi: 468,
    status: AQILevel.HAZARDOUS,
    primarySource: 'Heavy Vehicle Traffic (ISBT)',
    nearestSensor: 'CPCB - Anand Vihar ISBT',
    sensorDistance: '0.3km',
    windSpeed: 2.8,
    humidity: 62,
    lastUpdated: '2:50 PM',
    coordinates: { lat: 28.6465, lng: 77.3167 },
    pollutants: { pm25: 410, pm10: 580, no2: 92, so2: 25, co: 4.8 },
    breakdown: { transport: 75, construction: 10, industry: 5, waste: 10 },
    history: {
      hourly: generateHistory(24, 468),
      daily: generateHistory(7, 440),
      monthly: generateHistory(30, 410)
    }
  },
  {
    id: '141',
    no: 141, // Added missing 'no' property
    name: 'RK Puram',
    zone: 'South Delhi Zone',
    // Added missing 'region' property to satisfy the Ward interface
    region: 'South',
    aqi: 212,
    status: AQILevel.POOR,
    primarySource: 'Construction & Local Traffic',
    nearestSensor: 'DPCC - RK Puram Station',
    sensorDistance: '0.8km',
    windSpeed: 5.4,
    humidity: 45,
    lastUpdated: '2:55 PM',
    coordinates: { lat: 28.5660, lng: 77.1767 },
    pollutants: { pm25: 125, pm10: 240, no2: 48, so2: 12, co: 1.8 },
    breakdown: { transport: 40, construction: 45, industry: 0, waste: 15 },
    history: {
      hourly: generateHistory(24, 212),
      daily: generateHistory(7, 195),
      monthly: generateHistory(30, 180)
    }
  },
  {
    id: '158',
    no: 158, // Added missing 'no' property
    name: 'Lodhi Road',
    zone: 'Central Delhi Zone',
    // Added missing 'region' property to satisfy the Ward interface
    region: 'Central',
    aqi: 88,
    status: AQILevel.GOOD,
    primarySource: 'Lush Greenery Buffer',
    nearestSensor: 'IMD - Lodhi Road',
    sensorDistance: '0.4km',
    windSpeed: 6.8,
    humidity: 40,
    lastUpdated: '3:00 PM',
    coordinates: { lat: 28.5910, lng: 77.2273 },
    pollutants: { pm25: 32, pm10: 68, no2: 18, so2: 4, co: 0.8 },
    breakdown: { transport: 30, construction: 10, industry: 0, waste: 60 },
    history: {
      hourly: generateHistory(24, 88),
      daily: generateHistory(7, 75),
      monthly: generateHistory(30, 70)
    }
  },
  // ... logically extending to all 250 wards
];
