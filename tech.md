# FloodTwin: Technology Stack & Architecture

This document outlines the complete technology stack, core libraries, and architectural decisions used to build **FloodTwin** for the Smart India Hackathon. 

---

## 1. System Architecture
FloodTwin follows a modern, decoupled **Client-Server Architecture**.
- **Frontend (Client):** A highly interactive, server-side rendered (SSR) web application.
- **Backend (API):** A RESTful API built on Node.js that serves real-time sensor data and area metadata.
- **Database:** A relational database for structured, scalable data storage.

---

## 2. Frontend Stack (User Interface & Maps)

**Core Frameworks:**
*   **[Next.js (v16)](https://nextjs.org/):** Used as the core React framework. We utilize the App Router for optimal routing, Server Components for performance, and API routes for internal proxying.
*   **[React (v19)](https://react.dev/):** The UI library for building component-based, state-driven interfaces.
*   **[TypeScript](https://www.typescriptlang.org/):** Ensures type safety across the entire application, preventing runtime errors during critical dashboard operations.
*   **[Tailwind CSS (v4)](https://tailwindcss.com/):** A utility-first CSS framework used to create the premium, glassmorphic, and highly responsive dark-mode UI.

**Important Frontend Libraries:**
*   **`maplibre-gl` & `@googlemaps/js-api-loader`:** 
    *   *Why we use it:* We implemented a **Dual Map Engine**. We use MapLibre (OpenStreetMap) for rendering custom vector layers, drainage networks, and flood polygons, with Google Maps API available as a robust fallback. This ensures the map never fails during a demo.
*   **`recharts`:** 
    *   *Why we use it:* Used to render the beautiful, animated line charts for "Nowcast Trends" (Water Depth vs. Rainfall) in the dashboard.
*   **`sonner`:** 
    *   *Why we use it:* Powers the automated dispatch notifications. It provides sleek, persistent "toast" alerts to simulate WhatsApp/SMS dispatching to field workers.
*   **`lucide-react`:** 
    *   *Why we use it:* Provides clean, modern SVG icons for the sidebar, buttons, and status indicators.
*   **`jspdf` & `jspdf-autotable`:** 
    *   *Why we use it:* Used in the Reports section to automatically generate and download professional, tabular PDF reports of flood incidents for municipal records.

---

## 3. Backend Stack (API & Business Logic)

**Core Frameworks:**
*   **[Node.js](https://nodejs.org/):** The JavaScript runtime environment executing the server code.
*   **[Express.js (v5)](https://expressjs.com/):** A fast, minimalist web framework used to create the RESTful API endpoints (`/api/sensors`, `/api/areas`).
*   **[TypeScript](https://www.typescriptlang.org/):** Ensures strict typing for API responses and database queries.

**Important Backend Libraries:**
*   **`cors`:** Middleware to allow the Next.js frontend (hosted elsewhere) to securely request data from the Express backend.
*   **`dotenv`:** Manages sensitive environment variables (like Database connection URLs).

---

## 4. Database Layer (Storage & ORM)

*   **[PostgreSQL](https://www.postgresql.org/):** The primary relational database used to store Sensor readings, Area metadata, and Historical Flood Events.
*   **[Neon (Serverless Postgres)](https://neon.tech/):** 
    *   *Why we use it:* We host our PostgreSQL database on Neon. It provides serverless scaling, meaning it can instantly handle massive spikes in traffic during a flood event without crashing.
*   **[Prisma ORM (v5)](https://www.prisma.io/):** 
    *   *Why we use it:* An Object-Relational Mapper that bridges our Node.js backend with the PostgreSQL database. It provides a highly readable `schema.prisma` file and prevents SQL injection attacks while offering strict TypeScript types for database queries.

---

## 5. Deployment & CI/CD

*   **Frontend Hosting:** **[Vercel](https://vercel.com/)**
    *   *Why we use it:* Vercel natively supports Next.js, providing Edge caching, instant GitHub CI/CD deployments, and global CDN distribution.
*   **Backend Hosting:** **[Render](https://render.com/)**
    *   *Why we use it:* Render provides reliable, continuous deployment for Node.js/Express web services directly from our GitHub repository.
*   **Version Control:** **GitHub** (used to trigger automated builds on both Vercel and Render).

---

## Pitching Tip for the Jury 💡
When the jury asks about your tech stack, focus on **Reliability** and **Scalability**. 
*   Mention the **Dual Map Engine** (MapLibre + Google Maps) to show you planned for API failures.
*   Mention **Neon Serverless Postgres** to show the system can auto-scale during a monsoon crisis.
*   Mention the **Decoupled Architecture** (Next.js + Express) which allows the mobile/frontend teams and backend teams to scale independently.
