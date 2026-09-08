# FloodTwin: Technology Stack & Architecture

This document outlines the complete technology stack, data pipeline, and machine learning architecture used to build **FloodTwin** for the Smart India Hackathon. It is designed to serve as a comprehensive guide for jury presentations.

---

## 1. System Architecture
FloodTwin follows a modern, decoupled **Client-Server Architecture**, designed for high availability during critical monsoon events.
- **Frontend (Client):** A highly interactive, server-side rendered (SSR) web application.
- **Backend (API):** A RESTful API built on Node.js that serves real-time sensor data and handles authentication.
- **Database:** A serverless relational database for structured, scalable data storage.

---

## 2. Where is the Data Coming From? (Data Pipeline)

For the purpose of the Hackathon demonstration, the live data you see moving on the screen (water levels, rainfall, cctv feeds) is driven by a **Dynamic Telemetry Engine** built into the frontend (`frontend/data/mockData.ts` and `DemoContext.tsx`). This simulates an active IoT data pipeline.

However, in a real-world deployment, this data pipeline is structured as follows:

### A. Ground-Truth IoT Sensors (Drainage & Streets)
- **What it is:** Ultrasonic water level sensors installed inside manholes and optical sensors mounted on street poles.
- **How it flows:** IoT devices send MQTT payloads to our backend (`/api/sensors`), which stores them in the PostgreSQL database. The frontend continuously polls or listens via WebSockets for these updates to animate the Live Map.

### B. India Meteorological Department (IMD) API Integration
- **What it is:** The IMD provides real-time and forecasted meteorological data via their API.
- **How we use it:** Our backend fetches **Precipitation (Rainfall in mm/hr)** forecasts for specific lat/long coordinates in Mumbai. 
- **Where it is on screen:** This IMD data directly feeds the **"Nowcast Simulator"** and the **"Rainfall"** telemetry charts on the dashboard. It acts as the primary "trigger" variable; when the IMD API reports an incoming surge in rainfall, FloodTwin preemptively simulates how that rain will affect the current IoT-measured drainage capacity.

---

## 3. Future Machine Learning (ML) Models

Currently, the "What-If Simulator" uses deterministic algorithms (math-based formulas) to estimate flood depth based on rainfall and drainage capacity. In the future, we will transition to a robust AI-driven approach using the following ML Models:

### A. Long Short-Term Memory Networks (LSTMs) for Time-Series Nowcasting
- **Purpose:** To predict the exact water depth at a specific street intersection 1 to 3 hours into the future.
- **Why LSTM:** LSTMs are perfect for sequential time-series data. They can look at the past 24 hours of IMD rainfall data and the past 24 hours of local IoT water-level data to predict the next 2 hours with high accuracy, taking soil saturation into account automatically based on historical patterns.

### B. Graph Neural Networks (GNNs) for Drainage Routing
- **Purpose:** To predict how a block (choke) in one drainage pipe will cause water to back up into other areas.
- **Why GNN:** A city's drainage system is a literal mathematical "Graph" (nodes are manholes, edges are pipes). GNNs can model the flow of water through this complex network and instantly identify which neighborhoods will flood if a specific pump station fails.

### C. Computer Vision (YOLOv8) for CCTV Analytics
- **Purpose:** To automatically detect waterlogging and verify sensor readings using municipal CCTV cameras.
- **Why YOLO:** We can train an object detection model to recognize when water covers the tires of vehicles or overtops footpaths. If a physical IoT sensor breaks, the CCTV model acts as a secondary verification system to trigger alerts.

---

## 4. Frontend Stack (User Interface & Maps)

**Core Frameworks:**
*   **[Next.js (v16)](https://nextjs.org/):** Used as the core React framework for optimal routing and performance.
*   **[React (v19)](https://react.dev/):** The UI library for building component-based interfaces.
*   **[TypeScript](https://www.typescriptlang.org/):** Ensures strict type safety, preventing dashboard crashes.
*   **[Tailwind CSS (v4)](https://tailwindcss.com/):** A utility-first CSS framework for a premium, responsive dark-mode UI.

**Important Frontend Libraries:**
*   **`maplibre-gl`:** Provides the highly performant vector map engine for rendering drainage lines and flood polygons.
*   **`recharts`:** Renders the dynamic time-series charts for IMD Rainfall vs. Water Depth.
*   **`sonner`:** Powers the persistent dispatch notification system.

---

## 5. Backend Stack (API & Database)

**Core Frameworks:**
*   **[Node.js] & [Express.js (v5)]:** Fast, scalable backend to handle high-frequency IoT data.
*   **[Prisma ORM (v5)]:** Securely bridges our Node.js API with the PostgreSQL database.

**Database Layer:**
*   **[Neon (Serverless Postgres)](https://neon.tech/):** We host our database on Neon because it provides **serverless auto-scaling**. During a massive flood event where API traffic spikes by 10,000%, Neon instantly scales compute resources to prevent the database from crashing.

---

## 6. Deployment & Authentication

*   **Frontend Hosting:** **Vercel** (Global CDN, instant CI/CD).
*   **Backend Hosting:** **Render** (Continuous deployment for Node APIs).
*   **Security:** Route Protection is implemented via local session management, ensuring only authorized BMC officials can access the command center and trigger field worker dispatches.

---

## Pitching Tip for the Jury 💡
When explaining the architecture to the jury, use this narrative:
> *"Our platform bridges the gap between **Macro and Micro** data. We take Macro-level weather forecasts directly from the **IMD API** and combine them with Micro-level, real-time ground truth from **IoT Sensors**. By feeding both data streams into our **LSTM Nowcasting Engine**, we don't just tell the municipality that it's raining—we tell them exactly which street will flood 2 hours before it happens."*
