// Safe Bypass Route Utility for FloodTwin
import { PUNE_WARDS_DATA, PuneWardArea } from '@/data/puneWardsData';

export function getWardById(id: string): PuneWardArea | undefined {
  return PUNE_WARDS_DATA.find((w) => w.id.toLowerCase() === id.toLowerCase() || w.name.toLowerCase() === id.toLowerCase());
}

export function searchPuneLocations(query: string): PuneWardArea[] {
  if (!query.trim()) return PUNE_WARDS_DATA;
  const q = query.toLowerCase();
  return PUNE_WARDS_DATA.filter(
    (w) =>
      w.name.toLowerCase().includes(q) ||
      w.ward.toLowerCase().includes(q) ||
      w.criticalNodes.some((node) => node.toLowerCase().includes(q))
  );
}
