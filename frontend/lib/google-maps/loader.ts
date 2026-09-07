import { setOptions, importLibrary } from '@googlemaps/js-api-loader';

let isConfiguredSet = false;

export function isGoogleMapsKeyConfigured(): boolean {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY?.trim();
  const configured = Boolean(
    apiKey &&
    apiKey !== 'YOUR_GOOGLE_MAPS_API_KEY_HERE' &&
    apiKey !== 'YOUR_GOOGLE_MAPS_API_KEY' &&
    apiKey !== 'YOUR_API_KEY' &&
    apiKey !== 'DEMO_MAP_ID' &&
    !apiKey.includes('YOUR_GOOGLE_MAPS')
  );
  if (typeof window !== 'undefined') {
    console.log('Google Maps API key configured:', configured);
  }
  return configured;
}

export function configureGoogleMaps(): void {
  if (!isConfiguredSet) {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY?.trim() || '';
    setOptions({
      key: apiKey,
      version: 'weekly',
    } as any);
    isConfiguredSet = true;
  }
}

export async function loadGoogleMapsLibraries() {
  configureGoogleMaps();

  const mapsLib = (await importLibrary('maps')) as google.maps.MapsLibrary;
  const markerLib = (await importLibrary('marker')) as google.maps.MarkerLibrary;

  return {
    google: window.google,
    maps: mapsLib,
    marker: markerLib,
  };
}
