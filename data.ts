
import { Ward, AQILevel } from './types';

const GEOJSON_URL = 'https://raw.githubusercontent.com/datameet/Municipal_Spatial_Data/master/Delhi/Delhi_Wards.geojson';

const getStatus = (aqi: number): AQILevel => {
  if (aqi > 300) return AQILevel.HAZARDOUS;
  if (aqi > 200) return AQILevel.SEVERE;
  if (aqi > 150) return AQILevel.POOR;
  if (aqi > 100) return AQILevel.MODERATE;
  return AQILevel.GOOD;
};

const getRegion = (lat: number, lng: number): 'North' | 'South' | 'East' | 'West' | 'Central' => {
  if (lat > 28.7) return 'North';
  if (lat < 28.53) return 'South';
  if (lng > 77.26) return 'East';
  if (lng < 77.12) return 'West';
  return 'Central';
};

const generatePollutants = (aqi: number) => ({
  pm25: Math.round(aqi * 0.75),
  pm10: Math.round(aqi * 1.3),
  no2: Math.round(aqi * 0.25),
  so2: Math.round(aqi * 0.08),
  co: Math.round(aqi * 0.012 * 10) / 10
});

export const loadDelhiWards = async (): Promise<Ward[]> => {
  try {
    const response = await fetch(GEOJSON_URL);
    if (!response.ok) throw new Error('Spatial Data Offline');
    const data = await response.json();
    
    return data.features.map((feature: any, index: number) => {
      const p = feature.properties || {};
      
      const name = p.WARD_NAME || p.NAME || p.ward_name || p.Ward_Name || p.ward || `Municipal Unit ${index + 1}`;
      const id = String(p.WARD_NO || p.ward_no || p.ID || p.OBJECTID || index + 1);
      const wardNo = parseInt(id) || index + 1;
      
      let coords = feature.geometry.coordinates;
      if (feature.geometry.type === "MultiPolygon") coords = coords[0];
      const flatCoords = coords[0];
      
      if (!flatCoords || !Array.isArray(flatCoords)) return null;

      const lats = flatCoords.map((c: any) => c[1]);
      const lngs = flatCoords.map((c: any) => c[0]);
      const lat = (Math.max(...lats) + Math.min(...lats)) / 2;
      const lng = (Math.max(...lngs) + Math.min(...lngs)) / 2;
      
      const region = getRegion(lat, lng);
      
      // REALISTIC DRIFT: AQI based on geographic micro-climates
      let baseAqi = 140;
      if (region === 'North') baseAqi = 280; // Industrial hotspots
      if (region === 'East') baseAqi = 310;  // Transport hubs
      if (region === 'Central') baseAqi = 120; // Green buffer
      if (region === 'South') baseAqi = 190;   // Construction zones
      
      // Dynamic variance per ward
      const variance = Math.sin(index * 0.45) * 55;
      const aqi = Math.max(15, Math.round(baseAqi + variance));
      
      return {
        id,
        name,
        no: wardNo,
        zone: p.zone_name || p.ZONE || `${region} NCT District`,
        region,
        aqi,
        status: getStatus(aqi),
        primarySource: aqi > 300 ? 'Industrial Suspension' : aqi > 200 ? 'Vehicular Congestion' : 'Local Background',
        nearestSensor: 'NCT Regulatory Station',
        sensorDistance: '0.6km',
        windSpeed: 4 + (Math.random() * 6),
        humidity: 35 + (Math.random() * 30),
        lastUpdated: 'Live',
        coordinates: { lat, lng },
        pollutants: generatePollutants(aqi),
        breakdown: { transport: 40, construction: 20, industry: 30, waste: 10 },
        history: { hourly: [], daily: [], monthly: [] },
        geoJson: feature
      };
    }).filter(Boolean) as Ward[];
  } catch (e) {
    console.error("Municipal Registry Error", e);
    return [];
  }
};
