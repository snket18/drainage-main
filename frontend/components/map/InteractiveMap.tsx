'use client';

import React from 'react';
import dynamic from 'next/dynamic';

const MapLibreFloodMap = dynamic(
  () => import('./MapLibreFloodMap'),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[620px] bg-slate-950 rounded-sm border border-slate-800  flex flex-col items-center justify-center space-y-3 shadow-sm">
        <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-sm animate-spin"></div>
        <p className="text-xs font-bold text-slate-300 font-mono tracking-wide">
          LOADING MAPLIBRE GIS ENGINE...
        </p>
        <span className="text-[11px] text-slate-500 font-mono">
          Loading Regional Map Data · CartoDB Dark Matter
        </span>
      </div>
    ),
  }
);

interface InteractiveMapProps {
  heightClass?: string;
  showLayerControl?: boolean;
  showLegend?: boolean;
  filter?: 'ALL' | 'INUNDATED_ONLY' | 'CLEAR_ONLY';
  onSelectRoute?: (routeId: 'safest' | 'fastest') => void;
  onSelectHotspot?: (hotspotId: string) => void;
  onInspectTelemetry?: (sensorId: string) => void;
}

import { useDemo } from '@/context/DemoContext';
import { MUMBAI_WARDS_DATA } from '@/data/mumbaiWardsData';

export const InteractiveMap: React.FC<InteractiveMapProps> = (props) => {
  const { selectedArea } = useDemo();
  // Map the selectedArea from search to the corresponding detailed MumbaiWardArea
  const selectedWardArea = React.useMemo(() => {
    return MUMBAI_WARDS_DATA.find(w => w.id === selectedArea.id) || {

    ...MUMBAI_WARDS_DATA[0],
    id: selectedArea.id,
    name: selectedArea.name,
    center: [selectedArea.centerCoordinates.lng, selectedArea.centerCoordinates.lat] as [number, number],
    originCoords: [selectedArea.centerCoordinates.lng - 0.005, selectedArea.centerCoordinates.lat - 0.005] as [number, number],
    destinationCoords: [selectedArea.centerCoordinates.lng + 0.005, selectedArea.centerCoordinates.lat + 0.005] as [number, number],
    floodedRouteGeoJSON: { type: 'FeatureCollection', features: [] } as GeoJSON.FeatureCollection,
    safeBypassGeoJSON: { type: 'FeatureCollection', features: [] } as GeoJSON.FeatureCollection,
    chokePoints: [],
    bypassAdvice: 'No safe route available for this area.',
    etaBypassMins: 0,
  };
  }, [selectedArea]);

  return (
    <MapLibreFloodMap
      filter={props.filter || 'ALL'}
      heightClass={props.heightClass || 'h-[620px]'}
      onSelectHotspot={props.onSelectHotspot}
      onInspectTelemetry={props.onInspectTelemetry}
      selectedWardArea={selectedWardArea}
      showLayerControl={props.showLayerControl}
    />
  );
};
