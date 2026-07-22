# ValetOS Backend

Lightweight Node/Express API for the ValetOS hackathon demo. All data lives in
memory — no database, no Docker, no cloud. Server restart reseeds the demo
data automatically.

## Run

```bash
# from repo root
npm install              # installs root deps (concurrently)
npm --prefix server install
npm run dev              # boots Next.js + this API together
```

Or run just the API on its own:

```bash
npm --prefix server run dev      # http://localhost:4000
```

## Demo credentials

| Role    | Email                  | Password    |
| ------- | ---------------------- | ----------- |
| Manager | manager@valetos.com    | password123 |
| Valet   | valet@valetos.com      | password123 |
| Admin   | admin@valetos.com      | password123 |

`POST /auth/login` returns a base64-encoded fake JWT — the payload can be
decoded by the client for display, but the server does not validate it.

## Endpoints

All responses use the shape `{ success, message, data }`.

### Auth
- `POST /auth/login`   — body: `{ email, password }`
- `POST /auth/logout`
- `GET  /auth/me`      — decodes the bearer token the client sent

### Dashboard
- `GET /dashboard`     — counts, recent vehicles, open incidents

### Spots
- `GET /spots`         — query: `floor`, `status`, `type`
- `GET /spots/:id`     — `id` or `qrCode` both work

### Vehicles
- `GET    /vehicles`                       — query: `status`, `customerId`, `valetId`, `floor`
- `GET    /vehicles/:id`                   — includes movement history
- `POST   /vehicles/checkin`               — multipart, field: `images` (up to 6)
- `PUT    /vehicles/:id/move`              — body: `{ spotId, reason?, valetId? }`
- `POST   /vehicles/:id/checkout`

### Pickup
- `GET  /pickup`                          — query: `status`
- `POST /pickup`                           — body: `{ vehicleId }` or `{ spotId }`
- `PUT  /pickup/:id/status`                — body: `{ status }` (`Requested|Assigned|Retrieving|Delivered`)

### Valets & customers
- `GET /valets` / `GET /valets/:id`
- `GET /customers`

### Incidents
- `GET  /incidents`                       — query: `status`, `severity`
- `POST /incidents`                        — body: `{ type, vehicleId?, description, severity?, reportedBy? }`

### Analytics
- `GET /analytics`                         — occupancy %, peak hour, avg retrieval/parking, leaderboard, hourly chart data, floor breakdown

### Misc
- `GET /health`
- `GET /uploads/*`                         — static images written by multer

## Live updates

Socket.IO at `ws://localhost:4000`. Events:

- `vehicle:parked`   — emitted on check-in
- `vehicle:moved`    — emitted on move
- `vehicle:delivered`— emitted on checkout / Delivered pickup
- `pickup:requested` / `pickup:updated`
- `incident:created`

## Seeded data

- 1 lot, 3 floors, 50 spots (each with a QR string like `PARK-A-F1-001`)
- 10 vehicles parked across the first 10 spots
- 5 valets, 2 managers, 20 customers, 1 admin
- 3 active pickup requests (one per status: Requested/Assigned/Retrieving)
- 3 incidents (one open, one in review, one resolved)
