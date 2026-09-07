// Safe Bypass Route Utility for FloodTwin
import { MUMBAI_WARDS_DATA, MumbaiWardArea } from '@/data/mumbaiWardsData';

export function getWardById(id: string): MumbaiWardArea | undefined {
  return MUMBAI_WARDS_DATA.find((w) => w.id.toLowerCase() === id.toLowerCase() || w.name.toLowerCase() === id.toLowerCase());
}

export function searchMumbaiLocations(query: string): MumbaiWardArea[] {
  if (!query.trim()) return MUMBAI_WARDS_DATA;
  const q = query.toLowerCase();
  return MUMBAI_WARDS_DATA.filter(
    (w) =>
      w.name.toLowerCase().includes(q) ||
      w.ward.toLowerCase().includes(q) ||
      w.criticalNodes.some((node) => node.toLowerCase().includes(q))
  );
}
