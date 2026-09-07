'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useDemo } from '@/context/DemoContext';
import { loadGoogleMapsLibraries, isGoogleMapsKeyConfigured } from '@/lib/google-maps/loader';
import { MapLayerControls, MapLayerState } from './MapLayerControls';
import { MapLegend } from './MapLegend';
import { ShieldAlert, Locate } from 'lucide-react';

interface GoogleMapViewProps {
  heightClass?: string;
  showLayerControl?: boolean;
  showLegend?: boolean;
  onSelectRoute?: (routeId: 'safest' | 'fastest') => void;
}

export const GoogleMapView: React.FC<GoogleMapViewProps> = ({
  heightClass = 'h-[550px]',
  showLayerControl = true,
  showLegend = true,
  onSelectRoute,
}) => {
  const { stepState, selectedArea, sensors, cctv, pipes } = useDemo();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null); // google.maps.Map or Leaflet Map instance
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);

  // Overlay references for cleanup
  const polygonsRef = useRef<any[]>([]);
  const polylinesRef = useRef<any[]>([]);
  const markersRef = useRef<any[]>([]);
  const selectedAreaMarkerRef = useRef<any | null>(null);

  const [mapLoaded, setMapLoaded] = useState(false);
  const [isLeafletMode, setIsLeafletMode] = useState(false);

  const [activeLayers, setActiveLayers] = useState<MapLayerState>({
    floodRisk: true,
    drainageNetwork: true,
    sensors: true,
    cctv: true,
    affectedRoads: true,
    emergencyRoutes: true,
  });

  const waterDepth = selectedArea.id === 'shivajinagar' ? stepState.maxWaterDepthCm : selectedArea.waterDepthCm;
  const isFlooded = waterDepth > 20;

  const handleToggleLayer = (layerKey: keyof MapLayerState) => {
    setActiveLayers((prev) => {
      const updated = { ...prev, [layerKey]: !prev[layerKey] };
      syncLayerVisibilities(updated);
      return updated;
    });
  };

  const syncLayerVisibilities = (layerState: MapLayerState) => {
    if (!isLeafletMode && mapRef.current) {
      polygonsRef.current.forEach((p) => p.setVisible?.(layerState.floodRisk));
      polylinesRef.current.forEach((pl: any) => {
        if (pl.layerType === 'drainage') pl.setVisible?.(layerState.drainageNetwork);
        if (pl.layerType === 'affectedRoads') pl.setVisible?.(layerState.affectedRoads);
        if (pl.layerType === 'emergencyRoutes') pl.setVisible?.(layerState.emergencyRoutes);
      });
      markersRef.current.forEach((m: any) => {
        if (m.markerType === 'sensor') m.map = layerState.sensors ? mapRef.current : null;
        if (m.markerType === 'cctv') m.map = layerState.cctv ? mapRef.current : null;
      });
    } else if (isLeafletMode && mapRef.current) {
      polygonsRef.current.forEach((p) => {
        if (layerState.floodRisk) p.addTo?.(mapRef.current);
        else p.remove?.();
      });
      polylinesRef.current.forEach((pl: any) => {
        const visible =
          (pl.layerType === 'drainage' && layerState.drainageNetwork) ||
          (pl.layerType === 'affectedRoads' && layerState.affectedRoads) ||
          (pl.layerType === 'emergencyRoutes' && layerState.emergencyRoutes);
        if (visible) pl.addTo?.(mapRef.current);
        else pl.remove?.();
      });
      markersRef.current.forEach((m: any) => {
        const visible =
          (m.markerType === 'sensor' && layerState.sensors) ||
          (m.markerType === 'cctv' && layerState.cctv);
        if (visible) m.addTo?.(mapRef.current);
        else m.remove?.();
      });
    }
  };

  // Initialize Map Engine (Google Maps JS API when key is valid, OpenStreetMap base map when unconfigured)
  useEffect(() => {
    let isMounted = true;

    // Intercept Google Maps auth failure callback and switch to open base map
    (window as any).gm_authFailure = () => {
      if (isMounted) {
        initLeafletMap();
      }
    };

    async function initMap() {
      if (!isGoogleMapsKeyConfigured()) {
        initLeafletMap();
        return;
      }

      try {
        const { google, maps, marker } = await loadGoogleMapsLibraries();

        if (!isMounted || !mapContainerRef.current) return;

        const mapId = process.env.NEXT_PUBLIC_GOOGLE_MAP_ID || 'DEMO_MAP_ID';
        const center = {
          lat: selectedArea.centerCoordinates.lat,
          lng: selectedArea.centerCoordinates.lng,
        };

        const map = new maps.Map(mapContainerRef.current, {
          center,
          zoom: 15,
          mapId,
          mapTypeId: 'roadmap',
          disableDefaultUI: false,
          zoomControl: true,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
        });

        mapRef.current = map;
        infoWindowRef.current = new maps.InfoWindow();

        renderGoogleOverlays(map, maps, marker);
        renderGoogleSelectedAreaIndicator(map, marker);
        setMapLoaded(true);
        setIsLeafletMode(false);
      } catch (err: any) {
        if (isMounted) {
          initLeafletMap();
        }
      }
    }

    async function initLeafletMap() {
      if (!isMounted || !mapContainerRef.current) return;

      if (!document.getElementById('leaflet-css')) {
        const link = document.createElement('link');
        link.id = 'leaflet-css';
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);
      }

      if (!(window as any).L) {
        await new Promise((resolve) => {
          const script = document.createElement('script');
          script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
          script.onload = resolve;
          document.head.appendChild(script);
        });
      }

      const L = (window as any).L;
      if (!L || !mapContainerRef.current) return;

      if ((mapContainerRef.current as any)._leaflet_id) {
        (mapContainerRef.current as any)._leaflet_id = null;
        mapContainerRef.current.innerHTML = '';
      }

      const center = [selectedArea.centerCoordinates.lat, selectedArea.centerCoordinates.lng];
      const map = L.map(mapContainerRef.current, {
        center,
        zoom: 15,
        zoomControl: true,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(map);

      mapRef.current = map;
      setIsLeafletMode(true);
      setMapLoaded(true);

      renderLeafletOverlays(L, map);
    }

    initMap();

    return () => {
      isMounted = false;
      clearAllOverlays();
      mapRef.current = null;
      setMapLoaded(false);
      delete (window as any).gm_authFailure;
    };
  }, []);

  // Sync camera pan on selectedArea change
  useEffect(() => {
    if (mapRef.current && mapLoaded && selectedArea) {
      if (!isLeafletMode) {
        mapRef.current.panTo({
          lat: selectedArea.centerCoordinates.lat,
          lng: selectedArea.centerCoordinates.lng,
        });
        mapRef.current.setZoom(15);
      } else {
        mapRef.current.setView(
          [selectedArea.centerCoordinates.lat, selectedArea.centerCoordinates.lng],
          15
        );
      }
    }
  }, [selectedArea, mapLoaded, isLeafletMode]);

  const clearAllOverlays = () => {
    if (!isLeafletMode) {
      polygonsRef.current.forEach((p) => p.setMap?.(null));
      polylinesRef.current.forEach((pl) => pl.setMap?.(null));
      markersRef.current.forEach((m) => (m.map = null));
      if (selectedAreaMarkerRef.current) selectedAreaMarkerRef.current.map = null;
    } else if (mapRef.current) {
      polygonsRef.current.forEach((p) => p.remove?.());
      polylinesRef.current.forEach((pl) => pl.remove?.());
      markersRef.current.forEach((m) => m.remove?.());
      if (selectedAreaMarkerRef.current) selectedAreaMarkerRef.current.remove?.();
    }
    polygonsRef.current = [];
    polylinesRef.current = [];
    markersRef.current = [];
    selectedAreaMarkerRef.current = null;
  };

  // Google Maps Overlays Renderer
  const renderGoogleOverlays = (
    map: google.maps.Map,
    maps: google.maps.MapsLibrary,
    markerLib: google.maps.MarkerLibrary
  ) => {
    clearAllOverlays();

    if (selectedArea.id === 'shivajinagar') {
      const ringCoords = [
        { lat: 18.5348, lng: 73.8424 },
        { lat: 18.5352, lng: 73.8504 },
        { lat: 18.5268, lng: 73.8514 },
        { lat: 18.5262, lng: 73.8434 },
      ];
      const riskPolygon = new maps.Polygon({
        paths: ringCoords,
        strokeColor: waterDepth > 30 ? '#dc2626' : waterDepth > 15 ? '#f59e0b' : '#06b6d4',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: waterDepth > 30 ? '#ef4444' : waterDepth > 15 ? '#fbbf24' : '#22d3ee',
        fillOpacity: 0.25,
        map,
      });
      polygonsRef.current.push(riskPolygon);
    }

    pipes.forEach((pipe) => {
      const path = [
        { lat: pipe.coordinates.from.lat, lng: pipe.coordinates.from.lng },
        { lat: pipe.coordinates.to.lat, lng: pipe.coordinates.to.lng },
      ];
      const isCritical = pipe.loadPct > 85;
      const isWarning = pipe.loadPct > 60;
      const strokeColor = isCritical ? '#dc2626' : isWarning ? '#f59e0b' : '#0284c7';

      const polyline: any = new maps.Polyline({
        path,
        strokeColor,
        strokeOpacity: 0.9,
        strokeWeight: isCritical ? 6 : 4,
        map,
      });
      polyline.layerType = 'drainage';
      polylinesRef.current.push(polyline);
    });

    sensors.forEach((sensor) => {
      const el = document.createElement('div');
      el.className =
        'gmap-sensor-marker flex items-center gap-1 bg-white border border-cyan-600 shadow-sm px-2 py-0.5 rounded-sm cursor-pointer hover:scale-105 transition-transform text-[11px] font-bold text-slate-900';
      el.innerHTML = `
        <span class="w-2 h-2 rounded-sm ${
          sensor.status === 'critical'
            ? 'bg-red-500 '
            : sensor.status === 'warning'
            ? 'bg-amber-500'
            : 'bg-cyan-500'
        }"></span>
        <span>${sensor.id}</span>
        <span class="text-[10px] text-cyan-700 font-extrabold ml-0.5">${sensor.value} ${sensor.unit}</span>
      `;
      try {
        const marker: any = new markerLib.AdvancedMarkerElement({
          map,
          position: { lat: sensor.coordinates.lat, lng: sensor.coordinates.lng },
          content: el,
          title: `${sensor.id}: ${sensor.name}`,
        });
        marker.markerType = 'sensor';
        markersRef.current.push(marker);
      } catch (_) {}
    });

    cctv.forEach((cam) => {
      const el = document.createElement('div');
      el.className =
        'gmap-cctv-marker flex items-center gap-1 bg-white border border-purple-600 shadow-sm px-2 py-0.5 rounded-sm cursor-pointer hover:scale-105 transition-transform text-[11px] font-bold text-slate-900';
      el.innerHTML = `
        <span class="w-2 h-2 rounded-sm ${cam.aiWaterDetection ? 'bg-red-500 ' : 'bg-purple-500'}"></span>
        <span>${cam.id}</span>
      `;
      try {
        const marker: any = new markerLib.AdvancedMarkerElement({
          map,
          position: { lat: cam.coordinates.lat, lng: cam.coordinates.lng },
          content: el,
          title: `${cam.id}: ${cam.name}`,
        });
        marker.markerType = 'cctv';
        markersRef.current.push(marker);
      } catch (_) {}
    });
  };

  const renderGoogleSelectedAreaIndicator = (map: google.maps.Map, markerLib: google.maps.MarkerLibrary) => {
    const el = document.createElement('div');
    el.className =
      'bg-slate-900 text-white border-2 border-orange-500 px-3 py-1 rounded-sm shadow-sm flex items-center gap-1.5 text-xs font-bold ';
    el.innerHTML = `
      <span class="w-2 h-2 rounded-sm bg-orange-400"></span>
      <span>${selectedArea.name}</span>
      <span class="text-[10px] text-orange-300 uppercase font-mono">SELECTED AREA</span>
    `;
    try {
      selectedAreaMarkerRef.current = new markerLib.AdvancedMarkerElement({
        map,
        position: { lat: selectedArea.centerCoordinates.lat, lng: selectedArea.centerCoordinates.lng },
        content: el,
      });
    } catch (_) {}
  };

  // Open Base Map Overlays Renderer
  const renderLeafletOverlays = (L: any, map: any) => {
    clearAllOverlays();

    const ringCoords = [
      [18.5348, 73.8424],
      [18.5352, 73.8504],
      [18.5268, 73.8514],
      [18.5262, 73.8434],
    ];
    const riskPolygon = L.polygon(ringCoords, {
      color: waterDepth > 30 ? '#dc2626' : waterDepth > 15 ? '#f59e0b' : '#06b6d4',
      fillColor: waterDepth > 30 ? '#ef4444' : waterDepth > 15 ? '#fbbf24' : '#22d3ee',
      fillOpacity: 0.25,
      weight: 2,
    }).addTo(map);
    riskPolygon.bindPopup(`<strong>Shivajinagar Flood Risk Zone</strong><br/>Predicted Water Depth: <strong>${waterDepth} cm</strong>`);
    polygonsRef.current.push(riskPolygon);

    pipes.forEach((pipe) => {
      const latlngs = [
        [pipe.coordinates.from.lat, pipe.coordinates.from.lng],
        [pipe.coordinates.to.lat, pipe.coordinates.to.lng],
      ];
      const isCritical = pipe.loadPct > 85;
      const strokeColor = isCritical ? '#dc2626' : pipe.loadPct > 60 ? '#f59e0b' : '#0284c7';

      const polyline: any = L.polyline(latlngs, {
        color: strokeColor,
        weight: isCritical ? 6 : 4,
        opacity: 0.9,
      }).addTo(map);
      polyline.layerType = 'drainage';
      polyline.bindPopup(`<strong>Trunk Main ${pipe.id}</strong><br/>Flow: ${pipe.currentFlowM3s} m³/s<br/>Load: ${pipe.loadPct}%`);
      polylinesRef.current.push(polyline);
    });

    sensors.forEach((sensor) => {
      const icon = L.divIcon({
        className: 'custom-leaflet-marker',
        html: `<div class="flex items-center gap-1 bg-white border border-cyan-600 shadow-sm px-2 py-0.5 rounded-sm text-[11px] font-bold text-slate-900 whitespace-nowrap">
          <span class="w-2 h-2 rounded-sm ${sensor.status === 'critical' ? 'bg-red-500 ' : 'bg-cyan-500'}"></span>
          <span>${sensor.id}</span>
          <span class="text-[10px] text-cyan-700 font-extrabold ml-0.5">${sensor.value} ${sensor.unit}</span>
        </div>`,
        iconSize: [80, 24],
        iconAnchor: [40, 12],
      });
      const marker: any = L.marker([sensor.coordinates.lat, sensor.coordinates.lng], { icon }).addTo(map);
      marker.markerType = 'sensor';
      marker.bindPopup(`<strong>Sensor ${sensor.id}</strong>: ${sensor.name}<br/>Value: <strong>${sensor.value} ${sensor.unit}</strong>`);
      markersRef.current.push(marker);
    });

    cctv.forEach((cam) => {
      const icon = L.divIcon({
        className: 'custom-leaflet-marker',
        html: `<div class="flex items-center gap-1 bg-white border border-purple-600 shadow-sm px-2 py-0.5 rounded-sm text-[11px] font-bold text-slate-900 whitespace-nowrap">
          <span class="w-2 h-2 rounded-sm ${cam.aiWaterDetection ? 'bg-red-500 ' : 'bg-purple-500'}"></span>
          <span>${cam.id}</span>
        </div>`,
        iconSize: [60, 24],
        iconAnchor: [30, 12],
      });
      const marker: any = L.marker([cam.coordinates.lat, cam.coordinates.lng], { icon }).addTo(map);
      marker.markerType = 'cctv';
      marker.bindPopup(`<strong>Camera ${cam.id}</strong>: ${cam.name}<br/>Location: ${cam.location}`);
      markersRef.current.push(marker);
    });

    const selectedIcon = L.divIcon({
      className: 'custom-leaflet-selected-marker',
      html: `<div class="bg-slate-900 text-white border-2 border-orange-500 px-3 py-1 rounded-sm shadow-sm flex items-center gap-1.5 text-xs font-bold whitespace-nowrap">
        <span class="w-2 h-2 rounded-sm bg-orange-400"></span>
        <span>${selectedArea.name}</span>
        <span class="text-[10px] text-orange-300 uppercase font-mono">SELECTED AREA</span>
      </div>`,
      iconSize: [160, 30],
      iconAnchor: [80, 15],
    });
    selectedAreaMarkerRef.current = L.marker(
      [selectedArea.centerCoordinates.lat, selectedArea.centerCoordinates.lng],
      { icon: selectedIcon }
    ).addTo(map);
  };

  return (
    <div className={`relative w-full ${heightClass} bg-slate-100 border border-slate-200 rounded-sm overflow-hidden shadow-xs flex flex-col justify-between`}>
      {/* Top Overlay Stack: Layer Control Bar */}
      {showLayerControl && mapLoaded && (
        <div className="absolute top-3 left-3 right-3 z-20 pointer-events-none">
          <div className="pointer-events-auto max-w-full">
            <MapLayerControls layers={activeLayers} onToggleLayer={handleToggleLayer} />
          </div>
        </div>
      )}

      {/* Reroute Alert Toast overlay when FC Road / JM Road Underpass is flooded */}
      {isFlooded && mapLoaded && (
        <div className="absolute top-16 left-4 right-4 max-w-lg mx-auto bg-red-900/90 text-white backdrop-blur-md px-4 py-2.5 rounded-sm border border-red-700 shadow-sm z-20 flex items-center justify-between text-xs  slide-in-">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-red-300 shrink-0" />
            <span className="font-bold">
              Route updated because JM Road Underpass is predicted to be flooded ({waterDepth} cm).
            </span>
          </div>
          {onSelectRoute && (
            <button
              onClick={() => onSelectRoute('safest')}
              className="ml-2 bg-white text-red-950 font-bold px-2.5 py-1 rounded-sm text-[11px] hover:bg-red-100 transition-colors shrink-0 cursor-pointer"
            >
              View Route
            </button>
          )}
        </div>
      )}

      {/* Map Container */}
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Center Camera Reset Button */}
      {mapLoaded && (
        <button
          onClick={() => {
            if (mapRef.current) {
              if (!isLeafletMode) {
                mapRef.current.panTo({
                  lat: selectedArea.centerCoordinates.lat,
                  lng: selectedArea.centerCoordinates.lng,
                });
                mapRef.current.setZoom(15);
              } else {
                mapRef.current.setView(
                  [selectedArea.centerCoordinates.lat, selectedArea.centerCoordinates.lng],
                  15
                );
              }
            }
          }}
          className="absolute bottom-4 right-14 bg-white/90 backdrop-blur-md p-2 rounded-sm border border-slate-200 shadow-sm text-slate-700 hover:text-slate-900 z-10 transition-colors cursor-pointer"
          title="Reset camera to selected area (Shivajinagar)"
        >
          <Locate className="w-4 h-4" />
        </button>
      )}

      {/* Relocated Map Legend Box (Docked on Bottom Right above Map Controls) */}
      {showLegend && mapLoaded && (
        <div className="absolute bottom-16 right-4 z-10 max-w-xs">
          <MapLegend />
        </div>
      )}
    </div>
  );
};
