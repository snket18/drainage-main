# 🌊 FloodTwin — Urban Flood Intelligence & Decision Support Platform

**FloodTwin** is an advanced urban flood nowcasting, drainage monitoring, and emergency management platform developed for municipal corporations and disaster management authorities (focused on Pune Municipal Corporation / Shivajinagar region).

---

## 🛠️ Technical Stack (Simple & Short)

* **Frontend Framework:** Next.js 16 (React 19, TypeScript, App Router)
* **Styling & UI:** Tailwind CSS v4, Lucide React (Icons)
* **Mapping & GIS:** 
  * **Primary:** Google Maps JavaScript API (`@googlemaps/js-api-loader`)
  * **Fallback:** OpenStreetMap (OSM Base Tiles) for keyless interactive demo mode
* **State & Architecture:** React Client Hooks (`useState`, `useEffect`, `useRef`), Client-side GIS Layer toggles, Next.js dynamic routing

---

## 🗺️ How the Map is Imported & Rendered

1. **Dynamic Loader (`lib/google-maps/loader.ts`):**
   * Uses `@googlemaps/js-api-loader` to load Google Maps libraries asynchronously (`maps`, `marker`).
   * Fetches the key securely from `process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`.

2. **Component Integration (`components/map/GoogleMapView.tsx`):**
   * Imported into `/map`, `/routing`, `/command-center`, `/area-overview`, and `/sensors` pages.
   * **Dual Engine Architecture:**
     * **Google Maps Engine:** When a valid API key is present, it mounts `google.maps.Map` with `AdvancedMarkerElement` (Sensors/CCTV), `google.maps.Polygon` (Flood Inundation Zones), and `google.maps.Polyline` (Drainage Conduit Pipes & Evacuation Routes).
     * **Keyless OSM Fallback Engine:** If no Google Maps API key is configured or authentication fails (`gm_authFailure`), the map automatically switches to an interactive OpenStreetMap canvas centered on **Shivajinagar, Pune (`18.5308° N, 73.8474° E`)**.

---

## 📊 How Data is Coming & Which Dataset is Used

### 1. How Data Flow Works
* Data is centrally stored as structured TypeScript data modules in `data/mockData.ts` and `data/searchData.ts`.
* Page views and map components import these datasets directly and simulate real-time sensor updates, level changes, and live alert telemetry.

### 2. Datasets Included
The project uses a localized spatial dataset modeled for **Shivajinagar & Mula-Mutha River Basin, Pune Municipal Corporation**:

* **IoT Water Level & Flow Sensor Dataset:**
  * 8 telemetry nodes tracking water depth (cm), river level gauges (m), flow rates ($m^3/s$), battery levels, signal strength, and trend direction (`rising` / `falling`).
* **CCTV AI Camera Dataset:**
  * 6 municipal camera feeds with AI-assisted water inundation detection, water depth estimation, traffic speed, and stream status.
* **Underground Storm Drainage Network Dataset:**
  * Polyline vectors representing main underground conduit pipes with pipe diameter ($mm$), conduit length ($m$), hydraulic capacity ($m^3/s$), load %, and silt obstruction levels.
* **Flood Inundation Risk Zones Dataset:**
  * GIS Polygons mapping low, medium, high, and critical flood risk polygons across Pune city wards (Jangali Maharaj Rd, FC Rd, Sangamwadi, etc.).
* **Emergency Evacuation Route Dataset:**
  * Calculated evacuation paths comparing **Safest Route** vs. **Blocked/Flooded Route** with segment-by-segment depth alerts.
* **Field Response Crew & Interventions Dataset:**
  * Live status and coordinates of mobile pumping units, field response teams, bypass deployments, and cleaning crews.

---

## 🚀 Getting Started

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Configure Environment Variables (Optional):**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
   NEXT_PUBLIC_GOOGLE_MAP_ID=your_google_map_id_here
   ```

3. **Run Development Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.
