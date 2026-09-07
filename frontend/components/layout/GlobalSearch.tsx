'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useDemo } from '@/context/DemoContext';
import { GLOBAL_SEARCH_INDEX, SearchResultItem } from '@/data/searchData';
import { Search, MapPin, Cpu, Video, GitMerge, X, Clock, Layers } from 'lucide-react';
import { useRouter } from 'next/navigation';

export const GlobalSearch: React.FC = () => {
  const { setSelectedAreaId, setDynamicSelectedArea, recentSearches, addRecentSearch } = useDemo();
  const [query, setQuery] = useState<string>('');
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [externalResults, setExternalResults] = useState<SearchResultItem[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setExternalResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=3`);
        const data = await res.json();
        const extMapped: SearchResultItem[] = data.map((d: any) => ({
          id: `ext-${d.place_id}`,
          title: d.display_name.split(',')[0],
          subtitle: d.display_name,
          category: 'Locations',
          badgeText: 'External',
          areaId: `ext-${d.place_id}`,
          areaName: d.display_name.split(',')[0],
          dynamicCoords: { lat: parseFloat(d.lat), lng: parseFloat(d.lon) },
        }));
        setExternalResults(extMapped);
      } catch (err) {
        console.error(err);
      } finally {
        setIsSearching(false);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [query]);

  const internalResults = query.trim()
    ? GLOBAL_SEARCH_INDEX.filter(
        (item) =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.subtitle.toLowerCase().includes(query.toLowerCase()) ||
          item.category.toLowerCase().includes(query.toLowerCase()) ||
          item.areaName.toLowerCase().includes(query.toLowerCase())
      )
    : GLOBAL_SEARCH_INDEX;

  const filteredResults = [...internalResults, ...externalResults];

  const categories = ['Locations', 'Wards', 'Roads', 'Drainage', 'Sensors', 'CCTV'] as const;

  const handleSelectResult = (item: any) => {
    if (item.dynamicCoords) {
      setDynamicSelectedArea({
        id: item.areaId,
        name: item.title,
        ward: 'External Area',
        zone: 'Global',
        isLiveDemo: false,
        status: 'NORMAL',
        waterDepthCm: 10,
        rainfallMmHr: 5,
        drainageCapacityPct: 50,
        timeToCriticalMins: null,
        affectedRoads: [],
        keyRoads: [],
        description: 'Dynamically searched location via OpenStreetMap.',
        riskDrivers: [],
        predictionFactors: { explanation: 'No AI prediction available for external areas.', confidencePct: 0, leadTimeMins: 0 },
        interventionRationale: { recommendedAction: 'N/A', proximity: '', availableCapacity: '', expectedEffect: '', responseTimeMins: 0, reasoning: '' },
        sensorsCount: 0,
        cctvCount: 0,
        centerCoordinates: item.dynamicCoords,
        lastUpdatedMinsAgo: 0,
      });
      setSelectedAreaId(item.areaId);
    } else {
      setDynamicSelectedArea(null);
      setSelectedAreaId(item.areaId);
    }
    
    addRecentSearch(item);
    setQuery('');
    setIsOpen(false);
    router.push('/');
  };

  const getCategoryIcon = (category: SearchResultItem['category']) => {
    switch (category) {
      case 'Locations':
      case 'Wards':
      case 'Roads':
        return <MapPin className="w-3.5 h-3.5 text-slate-500" />;
      case 'Sensors':
        return <Cpu className="w-3.5 h-3.5 text-slate-500" />;
      case 'CCTV':
        return <Video className="w-3.5 h-3.5 text-slate-500" />;
      case 'Drainage':
        return <GitMerge className="w-3.5 h-3.5 text-slate-500" />;
      default:
        return <Layers className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-md">
      {/* Search Input Box */}
      <div className="relative flex items-center">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
        <input
          type="text"
          value={query}
          onFocus={() => setIsOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          placeholder="Search area, road, ward, drainage node or sensor..."
          className="w-full bg-slate-950/80 border border-slate-700 rounded-sm pl-10 pr-9 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-slate-500 transition-all"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-3 text-slate-400 hover:text-white p-0.5"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-sm shadow-sm z-50 overflow-hidden text-slate-800 max-h-96 overflow-y-auto">
          {/* Recent Searches Section */}
          {!query.trim() && recentSearches.length > 0 && (
            <div className="p-3 border-b border-slate-100 bg-slate-50">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                <Clock className="w-3 h-3 text-slate-400" />
                <span>Recent Searches</span>
              </div>
              <div className="space-y-1">
                {recentSearches.map((item) => (
                  <button
                    key={`recent-${item.id}`}
                    onClick={() => handleSelectResult(item)}
                    className="w-full text-left p-2 rounded-sm hover:bg-white flex items-center justify-between text-xs transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      {getCategoryIcon(item.category)}
                      <span className="font-semibold text-slate-900">{item.title}</span>
                    </div>
                    <span className="text-[10px] text-slate-400">{item.category}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Grouped Results */}
          <div className="p-3 space-y-3">
            {categories.map((cat) => {
              const catResults = filteredResults.filter((r) => r.category === cat);
              if (catResults.length === 0) return null;

              return (
                <div key={cat} className="space-y-1">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2">
                    {cat} ({catResults.length})
                  </div>
                  {catResults.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleSelectResult(item)}
                      className="w-full text-left p-2 rounded-sm hover:bg-slate-100 transition-colors flex items-center justify-between group cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="p-1.5 rounded-md bg-slate-100 group-hover:bg-slate-200">
                          {getCategoryIcon(item.category)}
                        </div>
                        <div className="truncate">
                          <div className="text-xs font-semibold text-slate-900">
                            {item.title}
                          </div>
                          <div className="text-[10px] text-slate-500 truncate">
                            {item.subtitle}
                          </div>
                        </div>
                      </div>

                      <span className="text-[10px] text-slate-500 font-medium px-2 py-0.5 rounded bg-slate-100">
                        {item.badgeText}
                      </span>
                    </button>
                  ))}
                </div>
              );
            })}

            {filteredResults.length === 0 && (
              <div className="p-6 text-center text-xs text-slate-500">
                No matching location or asset found for &quot;{query}&quot;.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
