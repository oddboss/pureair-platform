
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON, CircleMarker, Tooltip } from 'react-leaflet';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Crosshair, Zap, ShieldAlert } from 'lucide-react';
import { Ward, Station, AppView } from '../types';
import { fetchRealTimeStations, interpolateWardAQI, getStatusFromAQI } from '../services/aqiService';

interface WardMapProps {
  wards: Ward[];
  simulationHour: number;
  onSelect: (ward: Ward) => void;
  theme: 'dark' | 'light';
  onNavigate: (v: AppView) => void;
}

const getAQIColor = (aqi: number) => {
  if (aqi > 300) return '#ff3b30'; // Red (Severe/Hazardous)
  if (aqi > 200) return '#ff9500'; // Orange (Poor)
  if (aqi > 100) return '#ffcc00'; // Yellow (Moderate)
  return '#34c759';                // Green (Good)
};

const WardMap: React.FC<WardMapProps> = ({ wards, simulationHour, onSelect, theme, onNavigate }) => {
  const [geoData, setGeoData] = useState<any>(null);
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [geojson, liveStations] = await Promise.all([
          fetch('https://raw.githubusercontent.com/datameet/Municipal_Spatial_Data/master/Delhi/Delhi_Wards.geojson').then(r => r.json()),
          fetchRealTimeStations()
        ]);

        const enhancedFeatures = geojson.features.map((feature: any, idx: number) => {
          const p = feature.properties || {};
          const wardName = p.WARD_NAME || p.NAME || `Ward ${idx + 1}`;
          const wardId = String(p.WARD_NO || p.OBJECTID || idx + 1);
          
          let coords = feature.geometry.coordinates;
          if (feature.geometry.type === "MultiPolygon") coords = coords[0];
          const flatCoords = coords[0];
          
          let lat = 28.6139;
          let lng = 77.2090;

          if (flatCoords && Array.isArray(flatCoords)) {
            const lats = flatCoords.map((c: any) => c[1]);
            const lngs = flatCoords.map((c: any) => c[0]);
            lat = (Math.max(...lats) + Math.min(...lats)) / 2;
            lng = (Math.max(...lngs) + Math.min(...lngs)) / 2;
          }
          
          const { aqi: baseAqi } = interpolateWardAQI([lat, lng], liveStations);
          const variation = Math.sin(idx * 0.45) * 60; // Increased variation
          const aqi = Math.max(10, Math.round(baseAqi + variation));
          
          return {
            ...feature,
            properties: {
              ...p,
              ward_name: wardName,
              ward_no: wardId,
              aqi: aqi,
              centroid: { lat, lng }
            }
          };
        });

        setGeoData({ ...geojson, features: enhancedFeatures });
        setStations(liveStations);
        setLoading(false);
      } catch (err) {
        console.error("Spatial Pipeline Sync Error", err);
      }
    };

    loadData();
  }, []);

  const wardStyle = (feature: any) => ({
    fillColor: getAQIColor(feature.properties.aqi),
    weight: 1,
    opacity: 0.15,
    color: 'white',
    fillOpacity: 0.7
  });

  const onEachWard = (feature: any, layer: any) => {
    const p = feature.properties;
    
    layer.on({
      click: () => {
        const wardMatch = wards.find(w => w.id === p.ward_no);
        if (wardMatch) {
          onSelect(wardMatch);
        } else {
          onSelect({
            id: p.ward_no,
            name: p.ward_name,
            no: parseInt(p.ward_no) || 0,
            aqi: p.aqi,
            status: getStatusFromAQI(p.aqi),
            zone: 'NCT Administrative Zone',
            region: 'NCT',
            primarySource: 'Simulated Matrix',
            lastUpdated: 'Live',
            coordinates: p.centroid,
            pollutants: { pm25: Math.round(p.aqi * 0.7), pm10: Math.round(p.aqi * 1.2), no2: 40, so2: 10, co: 1 },
            windSpeed: 4.5,
            humidity: 50,
            breakdown: { transport: 40, construction: 20, industry: 30, waste: 10 },
            history: { hourly: [], daily: [], monthly: [] }
          } as Ward);
        }
      },
      mouseover: (e: any) => {
        e.target.setStyle({ fillOpacity: 0.9, weight: 2.5, color: '#fff' });
      },
      mouseout: (e: any) => {
        e.target.setStyle({ fillOpacity: 0.7, weight: 1, color: 'white' });
      }
    });

    layer.bindTooltip(`
      <div class="p-3">
        <div class="text-[8px] font-black uppercase opacity-40 mb-1">Administrative Node ${p.ward_no}</div>
        <div class="text-[14px] font-black text-white uppercase tracking-tight">${p.ward_name}</div>
        <div class="flex items-center gap-2 mt-2">
           <div class="w-2.5 h-2.5 rounded-full" style="background: ${getAQIColor(p.aqi)}"></div>
           <span class="text-xs font-black tabular-nums" style="color: ${getAQIColor(p.aqi)}">${p.aqi} AQI</span>
        </div>
      </div>
    `, { sticky: true, className: 'glass-tooltip' });
  };

  if (loading) {
    return (
      <div className="w-full h-[600px] glass rounded-[56px] flex flex-col items-center justify-center gap-6">
        <div className="relative">
          <div className="w-12 h-12 border-2 border-emerald-500/10 border-t-emerald-500 rounded-full animate-spin" />
          <Zap className="absolute inset-0 m-auto text-emerald-500/20" size={16} />
        </div>
        <span className="text-[10px] font-black uppercase tracking-[0.6em] opacity-30">Decrypting Spatial Telemetry</span>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[700px] glass rounded-[64px] overflow-hidden shadow-2xl border border-white/5 group">
      <MapContainer center={[28.6139, 77.2090]} zoom={11} className="w-full h-full" zoomControl={false} attributionControl={false}>
        <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
        <GeoJSON 
          data={geoData} 
          style={wardStyle} 
          onEachFeature={onEachWard}
        />
        {stations.slice(0, 10).map(station => (
          <CircleMarker 
            key={station.uid} 
            center={[station.lat, station.lon]} 
            radius={8}
            pathOptions={{
              fillColor: getAQIColor(station.aqi),
              fillOpacity: 1,
              color: 'white',
              weight: 2,
              className: 'glow-point'
            }}
          >
            <Tooltip direction="top" offset={[0, -10]} className="glass-tooltip">
              <div className="text-[9px] font-black uppercase text-indigo-400 mb-0.5 tracking-widest">CPCB Station</div>
              <div className="text-[12px] font-bold text-white uppercase leading-none mb-1">{station.stationName}</div>
              <div className="text-xl font-black tabular-nums" style={{ color: getAQIColor(station.aqi) }}>{station.aqi} AQI</div>
            </Tooltip>
          </CircleMarker>
        ))}
      </MapContainer>

      {/* ATMOSCAN VISION TRIGGER */}
      <div className="absolute top-10 right-10 z-[1000] flex flex-col gap-4">
         <motion.button 
           whileHover={{ scale: 1.05 }}
           whileTap={{ scale: 0.95 }}
           onClick={() => onNavigate('scan')}
           className="w-16 h-16 glass rounded-2xl flex items-center justify-center border-white/20 shadow-2xl group/scan transition-all hover:bg-emerald-500 hover:text-black backdrop-blur-3xl"
         >
           <Camera size={26} />
           <div className="absolute right-full mr-6 opacity-0 group-hover/scan:opacity-100 transition-opacity pointer-events-none">
              <div className="glass px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap border-white/10">AtmosScan Vision Node</div>
           </div>
         </motion.button>

         <button className="w-16 h-16 glass rounded-2xl flex items-center justify-center border-white/10 opacity-40 hover:opacity-100 transition-opacity backdrop-blur-3xl">
            <Crosshair size={26} />
         </button>
      </div>

      {/* SPATIAL LEGEND */}
      <div className="absolute bottom-10 left-10 z-[1000] glass px-10 py-5 rounded-[32px] border-white/5 flex items-center gap-8 backdrop-blur-3xl bg-black/40">
         {[
           { label: 'Good', color: '#34c759' },
           { label: 'Moderate', color: '#ffcc00' },
           { label: 'Poor', color: '#ff9500' },
           { label: 'Severe', color: '#ff3b30' }
         ].map(item => (
           <div key={item.label} className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full shadow-lg" style={{ background: item.color }} />
              <span className="text-[9px] font-black uppercase tracking-[0.2em] opacity-30">{item.label}</span>
           </div>
         ))}
      </div>
    </div>
  );
};

export default WardMap;
