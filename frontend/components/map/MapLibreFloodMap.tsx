'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useDemo } from '@/context/DemoContext';
import { PUNE_CENTER, getMuthaRiverGeoJSON } from '@/data/puneDrainageNetwork';
import { runHydraulicSimulation, CalculatedNodeState, CalculatedEdgeState } from '@/utils/drainageGraphEngine';
import { RouteResult } from '@/utils/emergencyRouting';
import { PUNE_WARDS_DATA, PuneWardArea } from '@/data/puneWardsData';
import { Layers, Compass, Navigation, AlertOctagon } from 'lucide-react';

export type MapFilterOption = 'ALL' | 'INUNDATED_ONLY' | 'CLEAR_ONLY';

interface MapLibreFloodMapProps {
  filter?: MapFilterOption;
  heightClass?: string;
  inundatedGeoJSON?: GeoJSON.FeatureCollection;
  networkGeoJSON?: GeoJSON.FeatureCollection;
  nodes?: CalculatedNodeState[];
  edges?: CalculatedEdgeState[];
  activeRoute?: RouteResult | null;
  selectedWardArea?: PuneWardArea | null;
  showBypassOverlay?: boolean;
  onSelectHotspot?: (hotspotId: string) => void;
  onInspectTelemetry?: (sensorId: string) => void;
}

export default function MapLibreFloodMap({
  filter = 'ALL',
  heightClass = 'h-[600px] min-h-[500px]',
  inundatedGeoJSON: propInundatedGeoJSON,
  networkGeoJSON: propNetworkGeoJSON,
  nodes: propNodes = [],
  edges: propEdges = [],
  activeRoute: propActiveRoute = null,
  selectedWardArea: propSelectedWardArea = null,
  showBypassOverlay = true,
  onSelectHotspot,
  onInspectTelemetry,
}: MapLibreFloodMapProps) {
  const { stepState, currentStepIndex } = useDemo();
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<{ [id: string]: { marker: maplibregl.Marker; element: HTMLDivElement } }>({});
  const dynamicMarkersRef = useRef<maplibregl.Marker[]>([]);
  const routePinMarkersRef = useRef<maplibregl.Marker[]>([]);

  const [mapLoaded, setMapLoaded] = useState(false);
  const [activeLayers, setActiveLayers] = useState({
    muthaRiver: true,
    drainagePipes: true,
    inundationZones: true,
    nodeMarkers: true,
    emergencyRoute: true,
  });

  const activeWard = propSelectedWardArea || PUNE_WARDS_DATA[0];

  useEffect(() => {
    if (mapRef.current && mapLoaded && activeWard) {
      mapRef.current.flyTo({ center: activeWard.center, zoom: 14.5, essential: true });
    }
  }, [activeWard, mapLoaded]);

  // Initialize MapLibre GL map instance strictly inside client lifecycle hook
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Fail-safe OpenStreetMap raster tile source specification
    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: {
        version: 8,
        sources: {
          'osm-tiles': {
            type: 'raster',
            tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
            tileSize: 256,
            attribution: '&copy; OpenStreetMap Contributors',
          },
        },
        layers: [
          {
            id: 'osm-tiles-layer',
            type: 'raster',
            source: 'osm-tiles',
            minzoom: 0,
            maxzoom: 19,
          },
        ],
      },
      center: PUNE_CENTER, // [73.8567, 18.5204] Shivajinagar, Pune
      zoom: 14,
    });

    mapRef.current = map;

    map.addControl(new maplibregl.NavigationControl(), 'top-right');
    map.addControl(new maplibregl.ScaleControl({ unit: 'metric' }), 'bottom-left');

    map.on('load', () => {
      setMapLoaded(true);
      map.resize();

      // 1. Mutha River Channel Layer
      map.addSource('mutha-river-source', {
        type: 'geojson',
        data: getMuthaRiverGeoJSON(),
      });

      map.addLayer({
        id: 'mutha-river-glow',
        type: 'line',
        source: 'mutha-river-source',
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: {
          'line-color': '#0284c7',
          'line-width': 10,
          'line-opacity': 0.25,
        },
      });

      map.addLayer({
        id: 'mutha-river-line',
        type: 'line',
        source: 'mutha-river-source',
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: {
          'line-color': '#0369a1',
          'line-width': 4,
          'line-opacity': 0.85,
        },
      });

      // 2. Stormwater Network DAG Pipe Source & Layer
      map.addSource('drainage-pipes-source', {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: [] },
      });

      map.addLayer({
        id: 'drainage-pipes-layer',
        type: 'line',
        source: 'drainage-pipes-source',
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: {
          'line-color': ['get', 'color'],
          'line-width': 3,
          'line-opacity': 0.75,
        },
      });

      // 3. Hotspot Inundation Depth Polygons Source & Layer
      map.addSource('pune-hotspots-source', {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: [] },
      });

      map.addLayer({
        id: 'hotspot-polygons-fill',
        type: 'fill',
        source: 'pune-hotspots-source',
        paint: {
          'fill-color': ['get', 'fillColor'],
          'fill-opacity': ['get', 'fillOpacity'],
        },
      });

      map.addLayer({
        id: 'hotspot-polygons-outline',
        type: 'line',
        source: 'pune-hotspots-source',
        paint: {
          'line-color': ['get', 'strokeColor'],
          'line-width': 2,
          'line-opacity': 0.8,
        },
      });

      // 4. Primary Flooded Route Source & Layer (Solid Red Line with Semi-Transparent Buffer)
      map.addSource('primary-flooded-route-source', {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: [] },
      });

      map.addLayer({
        id: 'primary-flooded-route-casing',
        type: 'line',
        source: 'primary-flooded-route-source',
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: {
          'line-color': '#f43f5e',
          'line-width': 12,
          'line-opacity': 0.25,
        },
      });

      map.addLayer({
        id: 'primary-flooded-route-line',
        type: 'line',
        source: 'primary-flooded-route-source',
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: {
          'line-color': '#ef4444',
          'line-width': 5,
          'line-opacity': 0.95,
        },
      });

      // 5. Safe Bypass Route Source & Layer (Google Navigation Emerald Green Solid Line)
      map.addSource('safe-bypass-route-source', {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: [] },
      });

      map.addLayer({
        id: 'safe-bypass-route-glow',
        type: 'line',
        source: 'safe-bypass-route-source',
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: {
          'line-color': '#10b981',
          'line-width': 12,
          'line-opacity': 0.25,
        },
      });

      map.addLayer({
        id: 'safe-bypass-route-line',
        type: 'line',
        source: 'safe-bypass-route-source',
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: {
          'line-color': '#10b981',
          'line-width': 6,
          'line-opacity': 0.95,
        },
      });

      // Interactive Click on Hotspot Polygons
      map.on('click', 'hotspot-polygons-fill', (e: maplibregl.MapLayerMouseEvent) => {
        if (!e.features || e.features.length === 0) return;
        const props = e.features[0].properties as any;
        if (onSelectHotspot) onSelectHotspot(props.id);
        openHotspotPopup(map, props);
      });

      map.on('mouseenter', 'hotspot-polygons-fill', () => {
        map.getCanvas().style.cursor = 'pointer';
      });
      map.on('mouseleave', 'hotspot-polygons-fill', () => {
        map.getCanvas().style.cursor = '';
      });
    });

    const t1 = setTimeout(() => mapRef.current?.resize(), 300);
    const t2 = setTimeout(() => mapRef.current?.resize(), 600);

    const resizeObserver = new ResizeObserver(() => {
      if (mapRef.current) mapRef.current.resize();
    });

    if (mapContainerRef.current) resizeObserver.observe(mapContainerRef.current);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      resizeObserver.disconnect();
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Subscribe MapLibre to Incident Lifecycle Stage & Ward Area Overlay
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded) return;

    const activeRain = stepState ? stepState.rainfallMmHr : activeWard.rainfallMmHr;
    const activeDepth = stepState ? stepState.maxWaterDepthCm : activeWard.predictedWaterDepthCm;
    const simResult = runHydraulicSimulation(activeRain, 0);

    // Update Hydraulic & Inundation GeoJSON Sources
    if (map.getSource('pune-hotspots-source')) {
      const geoJson = propInundatedGeoJSON || simResult.inundatedHotspotsGeoJSON;
      (map.getSource('pune-hotspots-source') as maplibregl.GeoJSONSource).setData(geoJson);
    }

    if (map.getSource('drainage-pipes-source')) {
      const geoJson = propNetworkGeoJSON || simResult.drainageNetworkGeoJSON;
      (map.getSource('drainage-pipes-source') as maplibregl.GeoJSONSource).setData(geoJson);
    }

    // Clear previous route pin markers & choke point markers
    routePinMarkersRef.current.forEach((m) => m.remove());
    routePinMarkersRef.current = [];

    // Render Navigation Routes & Pins when showBypassOverlay or flooded state is active
    if (showBypassOverlay && activeWard) {
      if (map.getSource('primary-flooded-route-source')) {
        (map.getSource('primary-flooded-route-source') as maplibregl.GeoJSONSource).setData(
          activeWard.floodedRouteGeoJSON
        );
      }
      if (map.getSource('safe-bypass-route-source')) {
        (map.getSource('safe-bypass-route-source') as maplibregl.GeoJSONSource).setData(
          activeWard.safeBypassGeoJSON
        );
      }

      // Point A (Origin): Clean circular ring (14px) at FC Road
      const elA = document.createElement('div');
      elA.className = 'w-[14px] h-[14px] rounded-sm bg-white border-3 border-emerald-600 shadow-sm cursor-pointer transform hover:scale-125 transition-transform';
      const popupA = new maplibregl.Popup({ offset: 10 }).setHTML(`
        <div class="bg-white p-2.5 rounded-sm border border-slate-200 text-slate-900 shadow-sm text-xs font-sans">
          <span class="text-[10px] font-mono text-emerald-600 font-bold uppercase">ORIGIN (POINT A)</span>
          <h4 class="font-bold text-slate-900">Fergusson College Road</h4>
        </div>
      `);
      const markerA = new maplibregl.Marker({ element: elA })
        .setLngLat(activeWard.originCoords)
        .setPopup(popupA)
        .addTo(map);
      routePinMarkersRef.current.push(markerA);

      // Point B (Destination): Classic small pin (18px) at Shivajinagar Station
      const elB = document.createElement('div');
      elB.className = 'w-[18px] h-[18px] rounded-sm bg-slate-900 border-2 border-white text-white font-mono text-[10px] font-bold flex items-center justify-center shadow-sm cursor-pointer transform hover:scale-125 transition-transform';
      elB.innerText = 'B';
      const popupB = new maplibregl.Popup({ offset: 10 }).setHTML(`
        <div class="bg-white p-2.5 rounded-sm border border-slate-200 text-slate-900 shadow-sm text-xs font-sans">
          <span class="text-[10px] font-mono text-slate-700 font-bold uppercase">DESTINATION (POINT B)</span>
          <h4 class="font-bold text-slate-900">Shivajinagar Station Reconnect</h4>
        </div>
      `);
      const markerB = new maplibregl.Marker({ element: elB })
        .setLngLat(activeWard.destinationCoords)
        .setPopup(popupB)
        .addTo(map);
      routePinMarkersRef.current.push(markerB);

      // Single Incident Choke Point Marker (Sancheti Circle Underpass): Neat octagonal red road-closure icon
      activeWard.chokePoints.forEach((choke) => {
        const elChoke = document.createElement('div');
        elChoke.className = 'cursor-pointer transform hover:scale-105 transition-transform';
        elChoke.innerHTML = `
          <div class="flex items-center gap-1.5 bg-rose-600 text-white font-sans text-xs font-bold px-2.5 py-1 rounded-sm shadow-sm border border-rose-400">
            <span class="w-2 h-2 rounded-sm bg-white "></span>
            <span>Closed · Waterlogged ${choke.depthCm} cm</span>
          </div>
        `;

        const popupChoke = new maplibregl.Popup({ offset: 12 }).setHTML(`
          <div class="bg-white p-3 rounded-sm border border-rose-200 text-slate-900 shadow-sm max-w-xs space-y-1 font-sans">
            <span class="text-[10px] font-mono text-rose-600 font-bold uppercase">Road Submerged - Do Not Enter</span>
            <h4 class="text-xs font-bold text-slate-900">${choke.name}</h4>
            <p class="text-[11px] text-slate-600">${choke.description}</p>
          </div>
        `);

        const markerChoke = new maplibregl.Marker({ element: elChoke })
          .setLngLat(choke.coords)
          .setPopup(popupChoke)
          .addTo(map);

        routePinMarkersRef.current.push(markerChoke);
      });

      // Target Area Highlight Marker (For the specific searched area)
      const elTarget = document.createElement('div');
      elTarget.className = 'w-[20px] h-[20px] rounded-full bg-cyan-500 border-4 border-white shadow-lg cursor-pointer transform hover:scale-125 transition-transform flex items-center justify-center';
      
      // We can also add a ring around it for a "radar" effect
      const ring = document.createElement('div');
      ring.className = 'absolute w-full h-full rounded-full border-2 border-cyan-500 animate-ping opacity-75';
      elTarget.appendChild(ring);

      const popupTarget = new maplibregl.Popup({ offset: 15 }).setHTML(`
        <div class="bg-white p-3 rounded-sm border border-slate-200 text-slate-900 shadow-sm max-w-xs space-y-1 font-sans text-center">
          <span class="text-[10px] font-mono text-cyan-600 font-bold uppercase tracking-widest">SEARCHED LOCATION</span>
          <h4 class="text-sm font-bold text-slate-900">${activeWard.name}</h4>
        </div>
      `);

      const markerTarget = new maplibregl.Marker({ element: elTarget })
        .setLngLat(activeWard.center)
        .setPopup(popupTarget)
        .addTo(map);
      
      routePinMarkersRef.current.push(markerTarget);
    } else {
      if (map.getSource('primary-flooded-route-source')) {
        (map.getSource('primary-flooded-route-source') as maplibregl.GeoJSONSource).setData({
          type: 'FeatureCollection',
          features: [],
        });
      }
      if (map.getSource('safe-bypass-route-source')) {
        (map.getSource('safe-bypass-route-source') as maplibregl.GeoJSONSource).setData({
          type: 'FeatureCollection',
          features: [],
        });
      }
    }

    // Dewatering Pump Active Marker during RESPOND / DIAGNOSE
    dynamicMarkersRef.current.forEach((m) => m.remove());
    dynamicMarkersRef.current = [];

    if (stepState && (stepState.activePumpsCount > 0 || stepState.stepCode === 'DIAGNOSE' || stepState.stepCode === 'RESPOND')) {
      const el = document.createElement('div');
      el.className = 'cursor-pointer transform hover:scale-105 transition-transform';
      el.innerHTML = `
        <div class="flex items-center gap-1.5 bg-slate-900 text-cyan-400 font-mono text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm border border-cyan-500/50">
          <span class="w-1.5 h-1.5 rounded-sm bg-cyan-400 "></span>
          <span>⚡ Pump #4 (1.2 m³/s)</span>
        </div>
      `;

      const popup = new maplibregl.Popup({ offset: 12 }).setHTML(`
        <div class="bg-white p-3 rounded-sm border border-slate-200 text-slate-900 shadow-sm max-w-xs space-y-1 font-sans">
          <span class="text-[10px] font-mono text-cyan-600 font-bold uppercase">MUNICIPAL INTERVENTION ACTIVE</span>
          <h4 class="text-xs font-bold text-slate-900">Mobile Dewatering Unit #4</h4>
          <p class="text-[11px] text-slate-600">Discharging at 1.2 m³/s into Mutha River outfall.</p>
        </div>
      `);

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([73.8535, 18.5288])
        .setPopup(popup)
        .addTo(map);

      dynamicMarkersRef.current.push(marker);
    }
  }, [stepState, currentStepIndex, mapLoaded, propInundatedGeoJSON, propNetworkGeoJSON, activeWard, showBypassOverlay]);

  // Handle Fly-To when activeWard changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded || !activeWard) return;

    map.flyTo({
      center: activeWard.center,
      zoom: activeWard.zoom || 15,
      pitch: activeWard.pitch || 40,
      essential: true,
    });
  }, [activeWard, mapLoaded]);

  // Render Drainage Nodes as Subtle 3px Neutral Dots (No Overlapping Text Pills)
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded) return;

    const displayNodes = propNodes.length > 0 ? propNodes : runHydraulicSimulation(stepState ? stepState.rainfallMmHr : activeWard.rainfallMmHr, 0).nodes;

    Object.values(markersRef.current).forEach(({ marker }) => marker.remove());
    markersRef.current = {};

    displayNodes.forEach((node) => {
      const el = document.createElement('div');
      el.className = 'group cursor-pointer p-1';

      // Subtle 3px neutral dot (#94a3b8) without permanent text pill clutter
      el.innerHTML = `
        <div class="w-[3px] h-[3px] rounded-sm bg-[#94a3b8] group-hover:bg-slate-900 group-hover:scale-200 transition-all"></div>
      `;

      el.addEventListener('click', (ev) => {
        ev.stopPropagation();
        if (onSelectHotspot) onSelectHotspot(node.id);
        openNodePopup(map, node);
      });

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat(node.coordinates)
        .addTo(map);

      markersRef.current[node.id] = { marker, element: el };
    });
  }, [propNodes, stepState, currentStepIndex, activeWard, mapLoaded, onSelectHotspot]);

  // Handle Layer Filter Visibility
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded) return;

    if (map.getLayer('hotspot-polygons-fill')) {
      if (filter === 'INUNDATED_ONLY') {
        map.setFilter('hotspot-polygons-fill', ['==', ['get', 'isInundated'], 1]);
        map.setFilter('hotspot-polygons-outline', ['==', ['get', 'isInundated'], 1]);
      } else if (filter === 'CLEAR_ONLY') {
        map.setFilter('hotspot-polygons-fill', ['==', ['get', 'isInundated'], 0]);
        map.setFilter('hotspot-polygons-outline', ['==', ['get', 'isInundated'], 0]);
      } else {
        map.setFilter('hotspot-polygons-fill', null);
        map.setFilter('hotspot-polygons-outline', null);
      }
    }
  }, [filter, mapLoaded]);

  // Hotspot Feature Popup
  const openHotspotPopup = (map: maplibregl.Map, props: any) => {
    const badgeColor =
      props.status === 'CRITICAL'
        ? 'bg-rose-50 text-rose-700 border-rose-200'
        : props.status === 'WARNING'
        ? 'bg-amber-50 text-amber-700 border-amber-200'
        : 'bg-emerald-50 text-emerald-700 border-emerald-200';

    const popupHtml = `
      <div class="bg-white text-slate-900 p-4 rounded-sm border border-slate-200 shadow-sm max-w-xs space-y-3 font-sans">
        <div class="flex items-start justify-between gap-2">
          <div>
            <span class="text-[10px] font-mono text-slate-500 font-bold uppercase tracking-wider">${props.id}</span>
            <h3 class="text-sm font-bold text-slate-900 leading-tight mt-0.5">${props.name}</h3>
          </div>
          <span class="px-2 py-0.5 text-[10px] font-bold rounded-md border ${badgeColor}">
            ${props.status}
          </span>
        </div>

        <div class="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-2.5 rounded-sm border border-slate-100">
          <div>
            <span class="text-[10px] text-slate-500 block">Water Depth</span>
            <span class="text-sm font-extrabold text-slate-900">${props.depthCm} cm</span>
          </div>
          <div>
            <span class="text-[10px] text-slate-500 block">Hydraulic Load</span>
            <span class="text-sm font-extrabold text-slate-900">${props.capacityPct}%</span>
          </div>
        </div>

        <button 
          id="btn-inspect-${props.id}" 
          class="w-full py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-sm transition-colors shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <span>Inspect Node Telemetry</span>
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
        </button>
      </div>
    `;

    const popup = new maplibregl.Popup({ closeButton: true, maxWidth: '300px', offset: 12 })
      .setLngLat(props.coordinates || PUNE_CENTER)
      .setHTML(popupHtml)
      .addTo(map);

    setTimeout(() => {
      const btn = document.getElementById(`btn-inspect-${props.id}`);
      if (btn && onInspectTelemetry) {
        btn.addEventListener('click', () => {
          onInspectTelemetry(props.primarySensor || 'S-01');
          popup.remove();
        });
      }
    }, 50);
  };

  // Node Marker Popup
  const openNodePopup = (map: maplibregl.Map, node: CalculatedNodeState) => {
    const statusColor =
      node.status === 'CRITICAL'
        ? 'text-rose-700 bg-rose-50 border-rose-200'
        : node.status === 'WARNING'
        ? 'text-amber-700 bg-amber-50 border-amber-200'
        : 'text-emerald-700 bg-emerald-50 border-emerald-200';

    const popupHtml = `
      <div class="bg-white text-slate-900 p-3.5 rounded-sm border border-slate-200 shadow-sm max-w-xs space-y-2.5 font-sans">
        <div class="flex items-center justify-between">
          <span class="text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${statusColor}">
            ${node.type} NODE · ${node.id}
          </span>
        </div>
        <h4 class="text-xs font-bold text-slate-900">${node.name}</h4>
        <div class="text-xs text-slate-700 space-y-1 bg-slate-50 p-2.5 rounded border border-slate-100 font-mono">
          <div class="flex justify-between"><span>Street Water Depth:</span><strong class="text-slate-900">${node.surchargeDepthCm} cm</strong></div>
          <div class="flex justify-between"><span>Rational Runoff Q:</span><strong class="text-slate-900">${node.runoffLps} L/s</strong></div>
          <div class="flex justify-between"><span>Total Sump Inflow:</span><strong class="text-slate-900">${node.totalInflowLps} L/s</strong></div>
          <div class="flex justify-between"><span>Max Drain Capacity:</span><strong class="text-slate-900">${node.maxCapacityLps} L/s</strong></div>
        </div>
        <button 
          id="btn-telemetry-${node.id}"
          class="w-full py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded-sm transition-colors cursor-pointer border border-slate-200"
        >
          View Telemetry Feed
        </button>
      </div>
    `;

    const popup = new maplibregl.Popup({ closeButton: true, maxWidth: '280px', offset: 12 })
      .setLngLat(node.coordinates)
      .setHTML(popupHtml)
      .addTo(map);

    setTimeout(() => {
      const btn = document.getElementById(`btn-telemetry-${node.id}`);
      if (btn && onInspectTelemetry) {
        btn.addEventListener('click', () => {
          onInspectTelemetry(node.linkedSensorId || node.id);
          popup.remove();
        });
      }
    }, 50);
  };

  const toggleLayer = (layerKey: keyof typeof activeLayers) => {
    const map = mapRef.current;
    if (!map || !mapLoaded) return;

    const nextState = !activeLayers[layerKey];
    setActiveLayers((prev) => ({ ...prev, [layerKey]: nextState }));
    const visibility = nextState ? 'visible' : 'none';

    if (layerKey === 'muthaRiver') {
      if (map.getLayer('mutha-river-glow')) map.setLayoutProperty('mutha-river-glow', 'visibility', visibility);
      if (map.getLayer('mutha-river-line')) map.setLayoutProperty('mutha-river-line', 'visibility', visibility);
    } else if (layerKey === 'drainagePipes') {
      if (map.getLayer('drainage-pipes-layer')) map.setLayoutProperty('drainage-pipes-layer', 'visibility', visibility);
    } else if (layerKey === 'inundationZones') {
      if (map.getLayer('hotspot-polygons-fill')) map.setLayoutProperty('hotspot-polygons-fill', 'visibility', visibility);
      if (map.getLayer('hotspot-polygons-outline')) map.setLayoutProperty('hotspot-polygons-outline', 'visibility', visibility);
    } else if (layerKey === 'emergencyRoute') {
      if (map.getLayer('primary-flooded-route-casing')) map.setLayoutProperty('primary-flooded-route-casing', 'visibility', visibility);
      if (map.getLayer('primary-flooded-route-line')) map.setLayoutProperty('primary-flooded-route-line', 'visibility', visibility);
      if (map.getLayer('safe-bypass-route-glow')) map.setLayoutProperty('safe-bypass-route-glow', 'visibility', visibility);
      if (map.getLayer('safe-bypass-route-line')) map.setLayoutProperty('safe-bypass-route-line', 'visibility', visibility);
    }
  };

  const resetCamera = () => {
    if (mapRef.current) {
      const center = activeWard ? activeWard.center : PUNE_CENTER;
      mapRef.current.flyTo({ center, zoom: 14, essential: true });
    }
  };

  return (
    <div className={`relative w-full h-full min-h-[500px] ${heightClass} rounded-sm overflow-hidden border border-slate-200 bg-slate-50 shadow-xs flex flex-col`}>
      <div ref={mapContainerRef} className="w-full h-full min-h-[500px] flex-1 relative" />

      {/* Floating Layer Control Bar */}
      <div className="absolute top-4 left-4 z-10 flex flex-wrap items-center gap-2">
        <div className="bg-white/95 backdrop-blur-md border border-slate-200/90 p-1.5 rounded-sm shadow-xs flex items-center gap-1 text-xs">
          <Layers className="w-4 h-4 text-slate-500 ml-1.5" />
          <button
            onClick={() => toggleLayer('inundationZones')}
            className={`px-2.5 py-1 rounded-sm text-[11px] font-semibold transition-all cursor-pointer ${
              activeLayers.inundationZones ? 'bg-slate-100 text-slate-900 font-bold border border-slate-200' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Hazard Zones
          </button>
          <button
            onClick={() => toggleLayer('drainagePipes')}
            className={`px-2.5 py-1 rounded-sm text-[11px] font-semibold transition-all cursor-pointer ${
              activeLayers.drainagePipes ? 'bg-slate-100 text-slate-900 font-bold border border-slate-200' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Pipes (DAG)
          </button>
          <button
            onClick={() => toggleLayer('emergencyRoute')}
            className={`px-2.5 py-1 rounded-sm text-[11px] font-semibold transition-all cursor-pointer ${
              activeLayers.emergencyRoute ? 'bg-slate-100 text-slate-900 font-bold border border-slate-200' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Navigation Overlay
          </button>
        </div>

        <button
          onClick={resetCamera}
          className="bg-white/95 backdrop-blur-md border border-slate-200 hover:bg-slate-50 text-slate-700 p-2 rounded-sm shadow-xs transition-all cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
        >
          <Compass className="w-4 h-4 text-slate-600" />
          <span className="hidden sm:inline">Reset View</span>
        </button>
      </div>

      {/* Floating Google Maps Route Summary Card at Bottom Center */}
      {showBypassOverlay && activeWard && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 bg-white/95 backdrop-blur-md border border-slate-200/90 px-4 py-2.5 rounded-sm shadow-sm flex items-center gap-3 text-xs text-slate-900 font-semibold  slide-in- max-w-md">
          <div className="w-3 h-3 rounded-sm bg-emerald-500 shrink-0 "></div>
          <div className="truncate">
            <span className="text-slate-900 font-bold">Via FC Road Flyover</span>
            <span className="text-slate-400 font-normal mx-1.5">•</span>
            <span className="text-emerald-700 font-bold font-mono">{activeWard.etaBypassMins} min</span>
            <span className="text-slate-400 font-normal mx-1.5">•</span>
            <span className="text-slate-500 font-medium truncate">Avoids {activeWard.predictedWaterDepthCm} cm flood at Sancheti Circle</span>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-4 right-4 z-10 bg-white/95 backdrop-blur-md border border-slate-200 p-3 rounded-sm shadow-xs text-xs space-y-1.5 max-w-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-1">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Navigation Legend
          </span>
        </div>
        <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[11px] text-slate-600 font-medium">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-1 bg-rose-500 rounded"></span>
            <span>Submerged (Blocked)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-1 bg-emerald-500 rounded"></span>
            <span>Safe Bypass Corridor</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-white border-2 border-emerald-600"></span>
            <span>Point A (Origin)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-slate-900"></span>
            <span>Point B (Dest)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
