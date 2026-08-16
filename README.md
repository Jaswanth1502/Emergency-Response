# 🌐 AEGIS TWIN — Smart City Digital Twin Emergency Operations Platform

[![React](https://img.shields.io/badge/React-19.2.6-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7.3.2-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-WebGL_3D-black?logo=three.js&logoColor=white)](https://threejs.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.1.17-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](LICENSE)

**AEGIS TWIN (Metro EOC)** is an autonomous, next-generation **Smart City Digital Twin & Crisis Intelligence Platform**. Engineered for Municipal Emergency Operations Centers (EOC), it unifies 3D holographic CAD blueprint simulations, real-time IoT edge sensor arrays, predictive AI dispatch recommendations, dynamic evacuation routing, trauma net hospital triage, operational analytics, after-action reports, and Wireless Emergency Alerts (WEA) into an **Apple Liquid Glassmorphism** interface.

---

## 📸 Key Features & Operational Modules

### 1. 🌌 Cinematic Canvas Landing & Command Sign-In
- **210-Frame Canvas Sequence Engine**: High-framerate 30 FPS background video canvas rendering with automatic viewport cover and fluid memory management.
- **Apple Liquid Glassmorphism**: Dual specular highlight borders (`inset 0 1px 1px 0 rgba(255,255,255,0.95)`), `backdrop-filter: blur(24px) saturate(190%)`, and physical button active press physics.
- **Role-Based Command Sign-In**: Instant profile switching (`ADMIN`, `OPERATOR`, `ANALYST`) with TLS 1.3 cryptographic watermark.

### 2. 🏙️ 3D Holographic Blueprint Digital Twin (`/digital-twin`)
- **Three.js WebGL Blueprint Engine**: Dark navy CAD grid (`#060C18`), coordinate tick axes, and extruded geometric 3D wireframe skyscrapers.
- **Interactive Accident Hotspots**: Pulsing 3D laser cordon pillars, floating octahedron beacons, and ground radar rings for active hazards (450 Mission Fire, Market St Transit Collision, 8th & Market Gas Rupture, Pier 28 Seawall Surge).
- **Raycasted Area & Accident Dossier**: Click any building or accident marker in 3D to inspect real area dimensions, floor sectors, casualty counts, risk indices, and dispatched units.
- **Tactical 2D/3D Switcher**: Seamless one-click toggling between the 3D Blueprint Digital Twin and 2D GIS Tactical Map.

### 3. 🚒 Predictive Resource Dispatch (`/resources`)
- **AI Recommendation Engine**: 94% confidence machine-learning dispatch matrix for multi-hazard incidents.
- **Explainable Reasoning Chains**: 3-factor causality breakdown (Thermal Flashover Risk, Structural Steel Integrity, Ingress Road Density).
- **Interactive Fleet Assignment**: Direct unit allocation with live speed, battery %, and base station telemetry.

### 4. 🛣️ Dynamic Evacuation Corridors & Safety (`/evacuation`)
- **Real-Time Corridor Routing**: Color-coded primary, secondary, and dedicated first-responder safety corridors.
- **Civic Relief Shelters**: Live occupancy progress bars for Moscone Center West, Civic Auditorium, and Kezar Pavilion.
- **Broadcast Evacuation Orders**: Immediate high-priority order dispatch to emergency responder networks.

### 5. 🚑 Emergency Response Fleet (`/fleet`)
- **16 Tactical Units**: Fire Engines, Super Foam Pumpers, ALS Ambulances, USAR Heavy Rescue, Recon Drones, and Police Interceptors.
- **Unit Telemetry**: Status pulse pills, crew size, assigned incident, base coordinates, and filter by unit category.

### 6. 🏥 Hospitals & Medical Surge Capacity (`/hospitals`)
- **Trauma Net Synchronization**: Live intake queues across Level-1 Trauma, Regional Medical, and Burn Centers.
- **Capacity Telemetry**: Bed occupancy progress meters, ICU available counters, Burn Unit indicators, and average ER wait times.
- **Direct Ambulance Routing**: One-click dispatch action to reroute incoming emergency medical transit.

### 7. 📡 Smart City IoT Sensor Telemetry (`/sensors`)
- **8 Edge Sensor Streams**: Thermal arrays, optical smoke detectors, methane (CH4) sniffers, submersible water transducers, seismic accelerometers, particulate PM2.5 monitors, and pedestrian infrared flow sensors.
- **6-Bar Sparkline History**: 30-minute historical trend tracking with threshold breach indicators.

### 8. 📈 Operational Analytics & KPI Benchmarks (`/analytics`)
- **Executive KPI Cards**: Avg Response Time (5.2 min), Incident Clearance Rate (89.4%), Fleet Efficiency Index (94.1), and AI Dispatch Accuracy (96.8%).
- **Hourly Response Performance**: Bar chart comparison of arrival latencies vs 6.0 min municipal benchmarks.
- **Disaster Category Distribution & Fleet Load Curves**: Breakdown across Fire, Flood, HazMat, Collision, Structural, and Crowd surge.

### 9. 📋 Incident After-Action Reports & Audit Logs (`/reports`)
- **Verified Audit Dossiers**: Cryptographically certified After-Action Reports (AAR) with SHA-256 integrity verification.
- **Civilian Impact & Casualty Triage**: 5-tier casualty classifications (Critical, Moderate, Minor, Evacuated, Missing).
- **Chain of Custody**: Timestamped audit trail of autonomous detections and human commander approvals.

### 10. ⚠️ Emergency Alerts & Public Cell Broadcast (`/alerts`)
- **Live Alert Stream**: Prioritized system warnings with protocol actions, location tags, and instant acknowledge controls.
- **Public Cell-Tower Broadcast (WEA)**: Geo-fenced Wireless Emergency Alert transmitter targeting civilian mobile devices with commander confirmation protocols.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend Framework** | React 19.2.6 (Hooks, Suspense, Lazy Loading) |
| **Language** | TypeScript 5.9.3 |
| **Bundler & Server** | Vite 7.3.2 |
| **3D Rendering** | Three.js 0.185.1 (WebGL, Raycasting, Perspective Camera Controls) |
| **Styling & Theme** | TailwindCSS 4.1.17, Apple Liquid Glassmorphism |
| **Animations & Motion** | Framer Motion 12.42.2 |
| **Icons** | Lucide React |
| **Charts** | Recharts 3.9.2 |

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** >= 18.0.0
- **npm** >= 9.0.0

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Jaswanth1502/Emergency-Response.git
cd Emergency-Response

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser to view the application.

### Building for Production

```bash
# Compile and bundle the single-file optimized distribution
npm run build

# Preview the production build locally
npm run preview
```

---

## 📂 Project Structure

```
├── public/
│   ├── bg-frames/              # 210 sequential HD animation frames
│   └── gradient-previews.html  # Horizon gradient palette previewer
├── src/
│   ├── components/
│   │   ├── common/             # Liquid Glass cards, pills, buttons, sequence canvas
│   │   ├── dialogs/            # Incident creation, resource deployment modals
│   │   ├── map/                # Tactical 2D GIS & Three.js 3D Blueprint Map engines
│   │   └── notifications/      # Notification drawers and system alerts
│   ├── context/
│   │   └── AppContext.tsx      # Global state for incidents, fleet, and sensors
│   ├── dummy-data/             # Incidents, resources, evacuation corridors, reports
│   ├── layouts/
│   │   ├── AuthLayout.tsx      # Transparent wrapper for canvas backgrounds
│   │   └── DashboardLayout.tsx # Floating liquid glass sidebar and header chrome
│   ├── pages/                  # 12 Dedicated operational command views
│   ├── types/                  # TypeScript interface definitions
│   ├── App.tsx                 # Route registry and code splitting
│   ├── index.css               # Apple Liquid Glassmorphism design tokens
│   └── main.tsx                # React root bootstrap
├── package.json
└── README.md
```

---

## 🛡️ License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

*Engineered with precision for Metropolitan Emergency Operations Centers.*
