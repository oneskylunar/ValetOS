# 🚗 ValetOS

> Smart Parking & Valet Management Platform powered by QR Codes.

ValetOS is a modern parking and valet management system that digitizes the complete valet parking workflow. Instead of relying on expensive IoT sensors or AI-powered parking cameras, every parking space is assigned a unique QR code. Valets simply scan the QR code when parking or moving a vehicle, allowing the system to maintain a real-time digital map of the parking facility.

The platform improves operational efficiency, enhances customer trust, and provides complete accountability for every vehicle from check-in to pickup.

---

## ✨ Features

### 🚗 QR-Based Parking
- Unique QR code assigned to every parking spot.
- Instant vehicle-to-spot mapping.
- No expensive sensors or infrastructure required.

### 🔢 Automatic Vehicle Logging
- OCR-based license plate recognition.
- Manual vehicle number entry.
- Automatic timestamp generation.
- Parking status tracking.

### 👤 Valet Accountability
- Employee login with unique ID.
- Every action linked to a specific valet.
- Complete audit trail.

### 📸 Vehicle Condition Recording
- Capture vehicle images during check-in.
- Multiple photos supported.
- Helps resolve damage disputes.

### 📍 Live Parking Map
- Real-time parking occupancy.
- Available and occupied spots.
- Interactive parking layout.

### 🔄 Vehicle Movement History
- Track every relocation.
- Movement timestamps.
- Assigned valet history.
- Reason for movement.

### 📲 Customer Vehicle Tracking
Customers can view:
- Parking location
- Assigned valet
- Vehicle status
- Pickup progress
- Estimated retrieval time

### 🔐 Secure Pickup Verification
- OTP/PIN verification
- QR-based pickup
- Prevents unauthorized vehicle release

### 📊 Analytics Dashboard
- Occupancy trends
- Peak parking hours
- Average parking duration
- Valet performance
- Parking heatmaps
- Daily reports

### 🔑 Key Management
- Digital key locker tracking
- Access logs
- Lost key prevention

### 🚨 Incident Reporting
- Damage reports
- Customer complaints
- Lost items
- Vehicle incidents

### 📩 Customer Notifications
- Vehicle parked
- Pickup initiated
- Vehicle ready
- SMS/WhatsApp notifications

---

# 🏗️ System Workflow

```text
Vehicle Arrives
       │
       ▼
Valet Login
       │
       ▼
Scan License Plate (OCR)
       │
       ▼
Scan Parking Spot QR
       │
       ▼
Capture Vehicle Photos
       │
       ▼
Vehicle Stored
       │
       ▼
Customer Receives Confirmation
       │
       ▼
Pickup Requested
       │
       ▼
PIN / QR Verification
       │
       ▼
Vehicle Delivered
```

---

# 🎯 Why ValetOS?

Traditional valet systems often rely on:
- Paper tickets
- Manual tracking
- Human memory
- Expensive sensor infrastructure

ValetOS replaces these with a scalable, software-first solution that requires only QR codes and a smartphone.

## Benefits

- 📉 Lower infrastructure costs
- ⚡ Faster vehicle retrieval
- 🔒 Increased accountability
- 📊 Actionable business insights
- 😊 Improved customer experience
- 🚗 Reduced vehicle search time

---

# 🏢 Ideal For

- Hotels
- Shopping Malls
- Hospitals
- Airports
- Corporate Offices
- Residential Societies
- Event Venues
- Restaurants
- Convention Centers

---

# 🛠️ Technology Stack

## Frontend
- Next.js (App Router)
- React 19
- Tailwind CSS v4
- TypeScript

## Backend
- Node.js
- Express.js
- Socket.IO (live updates: `vehicle:parked`, `pickup:requested`, etc.)
- Multer (vehicle image uploads to `server/uploads/`)
- CORS
- UUID for ids
- **In-memory data store** — arrays in `server/data/store.js`, reseeded on every restart. _No database._

## Database
- _Hackathon build:_ none. All state is in-memory.
- Production target: PostgreSQL / MongoDB.

## Authentication
- _Hackathon build:_ fake JWT (base64-encoded payload, `alg: "none"`). Three seeded accounts — manager, valet, admin. See the API section below.
- Production target: real JWT + role-based access control.

## OCR
- Google Vision API / Tesseract OCR (planned)

## Storage
- _Hackathon build:_ uploaded vehicle images are written to `server/uploads/` and served at `/uploads/*`.
- Production target: Cloud Storage (AWS S3 / Firebase Storage).

## Maps
- Interactive Parking Layout

---

# 🚀 How to Run

The API and the Next.js app boot together with a single command.

```bash
# from the repo root
npm install              # installs root dev deps (concurrently)
npm --prefix server install
npm run dev              # Next on http://localhost:3000, API on http://localhost:4000
```

Run just the API on its own:

```bash
npm run dev:api          # http://localhost:4000
```

Run just the Next.js frontend:

```bash
npm run dev:web          # http://localhost:3000
```

### Demo logins

| Role    | Email                | Password    |
| ------- | -------------------- | ----------- |
| Manager | manager@valetos.com  | password123 |
| Valet   | valet@valetos.com    | password123 |
| Admin   | admin@valetos.com    | password123 |

`POST /auth/login` returns a base64 fake JWT — the payload is decodable client-side for display, but the server does not validate it.

---

# 📡 API Surface

All responses use the shape `{ success, message, data }`. Full reference lives in [`server/README.md`](./server/README.md).

| Resource     | Endpoints                                                                                  |
| ------------ | ------------------------------------------------------------------------------------------ |
| Auth         | `POST /auth/login`, `POST /auth/logout`, `GET /auth/me`                                    |
| Dashboard    | `GET /dashboard`                                                                           |
| Spots        | `GET /spots`, `GET /spots/:id`                                                             |
| Vehicles     | `GET /vehicles`, `GET /vehicles/:id`, `POST /vehicles/checkin`, `PUT /vehicles/:id/move`, `POST /vehicles/:id/checkout` |
| Pickup       | `GET /pickup`, `POST /pickup`, `PUT /pickup/:id/status`                                    |
| Valets       | `GET /valets`, `GET /valets/:id`                                                           |
| Customers    | `GET /customers`                                                                           |
| Incidents    | `GET /incidents`, `POST /incidents`                                                        |
| Analytics    | `GET /analytics`                                                                           |
| Uploads      | `GET /uploads/*`                                                                           |
| Health       | `GET /health`                                                                              |
| Live feed    | `ws://localhost:4000` — `vehicle:parked`, `vehicle:moved`, `vehicle:delivered`, `pickup:requested`, `pickup:updated`, `incident:created` |

---

# 📂 Project Structure

```
ValetOS/
│
├── app/                  Next.js App Router (landing page UI)
│   ├── components/       Header, Hero, sections, etc.
│   ├── page.tsx
│   ├── layout.tsx
│   └── globals.css
│
├── server/               Hackathon backend (in-memory)
│   ├── controllers/      auth, dashboard, spots, vehicles, pickup, resources, analytics
│   ├── routes/           one router per resource
│   ├── middleware/       response helpers, multer upload
│   ├── data/store.js     seeded demo data (lots, spots, vehicles, valets, customers, etc.)
│   ├── uploads/          image uploads served at /uploads/*
│   ├── app.js            Express composition
│   ├── server.js         HTTP + Socket.IO entry
│   ├── package.json
│   └── README.md         full API reference
│
├── public/               static assets
│
├── package.json          workspace scripts (concurrently runs web + api)
├── tsconfig.json
├── next.config.ts
└── README.md
```

---

# 👥 User Roles

## 👨 Customer
- Track vehicle
- Request pickup
- View parking status
- Receive notifications

## 🚗 Valet
- Vehicle check-in
- QR scanning
- Vehicle movement
- Photo capture
- Pickup verification

## 🛡️ Manager
- Live dashboard
- Analytics
- Incident reports
- Employee monitoring
- Parking utilization

## ⚙️ Administrator
- Manage users
- Configure parking layout
- System settings
- Branch management

---

# 📈 Dashboard Metrics

- Active Vehicles
- Available Parking Spots
- Occupancy Rate
- Average Retrieval Time
- Average Parking Duration
- Valet Performance Score
- Peak Parking Hours
- Daily Revenue (Optional)

---

# 🔒 Security

- JWT Authentication
- Role-Based Permissions
- Vehicle Pickup Verification
- Audit Logs
- Encrypted Data Storage
- Secure API Endpoints

---

# 🚀 Future Roadmap

- AI License Plate Recognition
- Indoor Navigation
- Smart Parking Sensors
- CCTV Integration
- EV Charging Management
- Multi-Branch Support
- WhatsApp Integration
- Predictive Occupancy Analytics
- Automated Valet Assignment
- Digital Payments
- Loyalty & Membership Programs

---

# 📸 Screens

- Login
- Dashboard
- Live Parking Map
- Vehicle Check-in
- Vehicle Details
- Customer Tracking
- Analytics
- Settings

---

# 📄 License

This project is licensed under the MIT License.

---

# 💡 Vision

ValetOS aims to make valet parking **paperless, transparent, efficient, and scalable** by replacing manual parking operations with a simple QR-powered digital ecosystem. Whether managing a 50-space hotel parking lot or a 5,000-space airport facility, ValetOS provides complete visibility, accountability, and operational intelligence from check-in to pickup.
