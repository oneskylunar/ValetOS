# ValetOS

Smart Parking & Valet Management Platform powered by QR Codes.

ValetOS is a modern parking and valet management system that digitizes the complete valet parking workflow. Instead of relying on expensive IoT sensors or AI-powered parking cameras, every parking space is assigned a unique QR code. Valets simply scan the QR code when parking or moving a vehicle, allowing the system to maintain a real-time digital map of the parking facility.

The platform improves operational efficiency, enhances customer trust, and provides complete accountability for every vehicle from check-in to pickup.

---

## Problem It Solves

Traditional valet systems often rely on:
- Paper tickets
- Manual tracking
- Human memory
- Expensive sensor infrastructure

ValetOS replaces these with a scalable, software-first solution that requires only QR codes and a smartphone.

---

## Core Features

| Feature | Status | Description |
|---------|--------|-------------|
| QR-Based Parking | Implemented | Unique QR code for every parking spot |
| Live Parking Map | Implemented | Real-time occupancy view |
| Vehicle Tracking | Implemented | Monitor parking status |
| OTP Verification | Implemented | Secure pickup verification |
| Retrieval Progress | Implemented | Live retrieval timeline |
| Vehicle Check-in | Planned | Capture photos, scan QR |
| Movement History | Planned | Track relocations |
| Incident Reporting | Planned | Damage/complaint reports |
| Analytics Dashboard | Planned | Occupancy trends, reports |

---

## Customer Parking & Retrieval Flow

ValetOS uses **session-based identification** — no persistent customer accounts or passwords.

```
1. Scan QR → 2. Enter Phone → 3. Verify OTP → 4. View Status → 5. Request Retrieval → 6. Verify → 7. Pickup
```

### Steps:

1. **Scan QR Code** — Customer scans their valet token QR (simulated in UI)
2. **Phone Verification** — Enter 10-digit mobile number
3. **OTP Verification** — Verify with 6-digit OTP (demo: 123456)
4. **Parking Status** — View vehicle location, valet, slot info
5. **Request Retrieval** — Tap "Retrieve Car"
6. **Verify Identity** — OTP verification for security
7. **Live Progress** — Track valet bringing vehicle
8. **Complete** — Vehicle ready for pickup

Once the session ends, the customer's data is cleared. The next customer starts fresh.

---

## Valet/Staff Workflow

For valets and staff (internal operations):

- Vehicle check-in with photo capture
- QR scanning to assign parking spots
- Vehicle movement tracking
- Pickup request handling
- Incident reporting

Note: Staff authentication is currently not connected to the frontend.

---

## Tech Stack

### Frontend
- Next.js 16.2.10 (App Router)
- React 19.2.4
- Tailwind CSS v4
- TypeScript
- Framer Motion (animations)
- Lucide React (icons)

### Backend
- Node.js with Express.js
- Socket.IO (real-time events)
- Multer (file uploads)
- UUID (ID generation)

### Data Storage
- **In-memory only** — All data stored in JavaScript arrays, reseeded on server restart
- No database configured
- Production target: PostgreSQL or MongoDB

### Storage (Images)
- Uploaded vehicle images written to `server/uploads/`
- Served at `/uploads/*`
- Production target: Cloud storage (AWS S3 / Firebase)

---

## Project Architecture

```
ValetOS/
├── app/                    # Next.js App Router (frontend)
│   ├── components/        # Reusable UI components
│   ├── explore/          # Parking dashboard
│   ├── home/            # QR scanner + vehicle input
│   ├── parking-status/  # View parking info
│   ├── retrieval-progress/  # Live retrieval
│   ├── retrieve-verify/# OTP for retrieval
│   ├── verify/          # Phone + OTP verification
│   └── page.tsx        # Landing page
│
├── server/               # Express.js backend
│   ├── controllers/     # Business logic
│   ├── routes/         # API endpoints
│   ├── data/           # In-memory store
│   ├── uploads/        # Image uploads
│   ├── app.js          # Express app
│   └── server.js       # HTTP + Socket.IO
│
├── public/              # Static assets
└── package.json         # Workspace scripts
```

---

## Frontend Routes

| Route | Status | Description |
|-------|--------|-------------|
| `/` | Implemented | Landing page |
| `/home` | Implemented | QR scanner + vehicle input |
| `/explore` | Implemented | Parking dashboard |
| `/verify` | Implemented | Phone + OTP verification (combined) |
| `/parking-status` | Implemented | View parked vehicle info |
| `/retrieve-verify` | Implemented | OTP before retrieval |
| `/retrieval-progress` | Implemented | Live retrieval timeline |

All routes are directly accessible for demo purposes.

---

## Backend API Routes

All responses return `{ success, message, data }`.

| Endpoint | Method | Description |
|---------|--------|-------------|
| `/health` | GET | Server health check |
| `/dashboard` | GET | Overview metrics |
| `/spots` | GET | All parking spots |
| `/spots/:id` | GET | Single spot details |
| `/vehicles` | GET | All vehicles |
| `/vehicles/:id` | GET | Single vehicle |
| `/vehicles/checkin` | POST | Check in vehicle |
| `/vehicles/:id/move` | PUT | Move vehicle |
| `/vehicles/:id/checkout` | POST | Check out vehicle |
| `/pickup` | GET | All pickup requests |
| `/pickup` | POST | Create pickup request |
| `/pickup/:id/status` | PUT | Update pickup status |
| `/valets` | GET | All valets |
| `/valets/:id` | GET | Single valet |
| `/customers` | GET | All customers |
| `/incidents` | GET | All incidents |
| `/incidents` | POST | Create incident |
| `/analytics` | GET | Analytics data |
| `/uploads/*` | GET | Serve uploaded images |

**Note:** Auth endpoints (`/auth/*`) are not implemented. Frontend does not use backend authentication.

---

## Realtime Events (Socket.IO)

Socket.IO runs on port 4000. Clients can connect and listen for:

| Event | Description |
|-------|-------------|
| `hello` | Connection confirmation |
| `vehicle:parked` | New vehicle parked |
| `vehicle:moved` | Vehicle relocated |
| `vehicle:delivered` | Vehicle picked up |
| `pickup:requested` | New pickup request |
| `pickup:updated` | Pickup status changed |
| `incident:created` | New incident reported |

---

## Installation & Development

```bash
# Install dependencies
npm install
npm --prefix server install

# Run both frontend and backend
npm run dev

# Run frontend only (http://localhost:3000)
npm run dev:web

# Run backend only (http://localhost:4000)
npm run dev:api

# Build for production
npm run build
```

---

## Demo Data

The backend includes seeded demo data:

- **3 floors** (Ground Floor, Level 1, Rooftop) with 50 total spots
- **20 customers** with names, phones, emails
- **5 valets** with ratings and status
- **10 parked vehicles** with plates, brands, colors
- **3 pickup requests** in various states
- **3 incident reports**

Frontend uses separate mock data for the customer flow (Phoenix Mall, Tech Park, etc.).

---

## Current Limitations

- No persistent database — all data resets on server restart
- Frontend not connected to backend APIs
- No real SMS/OTP — uses demo OTP (123456)
- No QR scanner integration with backend
- No role-based authentication
- No actual file upload handling
- Socket.IO events not consumed by frontend

---

## Future Improvements

- Connect frontend to backend APIs
- Real OTP delivery (Twilio/Firebase)
- QR scanner integration
- Persistent database (PostgreSQL/MongoDB)
- Role-based access (customers, valets, managers, admins)
- Cloud storage for images
- Push notifications
- Payment integration
- Multi-branch support

---

## License

MIT License
