// In-memory data store for ValetOS.
// Designed for a hackathon demo: no DB, fully reseeded on every server start.
// Every export is a mutable array; controllers read/write these directly.

const { v4: uuid } = require('uuid');

// --- Parking lot layout -----------------------------------------------------
// 1 lot, 3 floors (F1, F2, F3), 50 spots total.
// Spot ids are stable so the frontend can deep-link.
const floors = [
  { id: 'F1', name: 'Ground Floor', total: 20 },
  { id: 'F2', name: 'Level 1', total: 16 },
  { id: 'F3', name: 'Rooftop', total: 14 },
];

const SPOT_TYPES = ['Standard', 'Compact', 'EV', 'Disabled'];
const spots = [];
let spotCounter = 1;
for (const floor of floors) {
  for (let i = 0; i < floor.total; i += 1) {
    const num = String(spotCounter).padStart(3, '0');
    const type = SPOT_TYPES[i % SPOT_TYPES.length];
    spots.push({
      id: `SPOT-${num}`,
      number: num,
      floor: floor.id,
      type,
      qrCode: `PARK-A-${floor.id}-${num}`,
      status: 'available', // available | occupied | reserved | maintenance
    });
    spotCounter += 1;
  }
}

// --- People -----------------------------------------------------------------
const customers = [
  { id: 'CUST-001', name: 'Aarav Mehta',    phone: '+91 98200 11101', email: 'aarav.mehta@example.com',   memberSince: '2024-03-12', visits: 28 },
  { id: 'CUST-002', name: 'Priya Sharma',   phone: '+91 98200 11102', email: 'priya.sharma@example.com',  memberSince: '2023-11-04', visits: 41 },
  { id: 'CUST-003', name: 'Rohan Iyer',     phone: '+91 98200 11103', email: 'rohan.iyer@example.com',    memberSince: '2025-01-20', visits: 9  },
  { id: 'CUST-004', name: 'Ananya Kapoor',  phone: '+91 98200 11104', email: 'ananya.kapoor@example.com', memberSince: '2024-07-08', visits: 17 },
  { id: 'CUST-005', name: 'Vikram Singh',   phone: '+91 98200 11105', email: 'vikram.singh@example.com',  memberSince: '2022-09-30', visits: 64 },
  { id: 'CUST-006', name: 'Neha Verma',     phone: '+91 98200 11106', email: 'neha.verma@example.com',    memberSince: '2025-05-15', visits: 4  },
  { id: 'CUST-007', name: 'Aditya Rao',     phone: '+91 98200 11107', email: 'aditya.rao@example.com',    memberSince: '2024-12-01', visits: 11 },
  { id: 'CUST-008', name: 'Ishita Joshi',   phone: '+91 98200 11108', email: 'ishita.joshi@example.com',  memberSince: '2023-06-22', visits: 33 },
  { id: 'CUST-009', name: 'Karan Bhatia',   phone: '+91 98200 11109', email: 'karan.bhatia@example.com',  memberSince: '2024-02-18', visits: 22 },
  { id: 'CUST-010', name: 'Tanya Malhotra', phone: '+91 98200 11110', email: 'tanya.malhotra@example.com',memberSince: '2025-03-09', visits: 7  },
  { id: 'CUST-011', name: 'Siddharth Jain', phone: '+91 98200 11111', email: 'sid.jain@example.com',      memberSince: '2023-08-14', visits: 38 },
  { id: 'CUST-012', name: 'Meera Pillai',   phone: '+91 98200 11112', email: 'meera.pillai@example.com',  memberSince: '2024-10-03', visits: 13 },
  { id: 'CUST-013', name: 'Arjun Desai',    phone: '+91 98200 11113', email: 'arjun.desai@example.com',   memberSince: '2025-06-21', visits: 2  },
  { id: 'CUST-014', name: 'Pooja Nair',     phone: '+91 98200 11114', email: 'pooja.nair@example.com',    memberSince: '2022-12-12', visits: 55 },
  { id: 'CUST-015', name: 'Rahul Saxena',   phone: '+91 98200 11115', email: 'rahul.saxena@example.com',  memberSince: '2024-04-19', visits: 19 },
  { id: 'CUST-016', name: 'Divya Kulkarni', phone: '+91 98200 11116', email: 'divya.k@example.com',       memberSince: '2025-02-25', visits: 6  },
  { id: 'CUST-017', name: 'Manav Choudhry', phone: '+91 98200 11117', email: 'manav.c@example.com',       memberSince: '2023-04-07', visits: 47 },
  { id: 'CUST-018', name: 'Riya Sengupta',  phone: '+91 98200 11118', email: 'riya.s@example.com',        memberSince: '2024-08-16', visits: 15 },
  { id: 'CUST-019', name: 'Harsh Agarwal',  phone: '+91 98200 11119', email: 'harsh.a@example.com',       memberSince: '2025-04-02', visits: 5  },
  { id: 'CUST-020', name: 'Sneha Reddy',    phone: '+91 98200 11120', email: 'sneha.reddy@example.com',   memberSince: '2023-10-29', visits: 30 },
];

const managers = [
  { id: 'MGR-001', name: 'Rajesh Khanna',  email: 'manager@valetos.com', phone: '+91 98000 00001', shift: 'Day (09:00 - 18:00)' },
  { id: 'MGR-002', name: 'Sunita Patil',   email: 'manager2@valetos.com',phone: '+91 98000 00002', shift: 'Night (18:00 - 03:00)' },
];

const valets = [
  { id: 'VAL-001', name: 'Mohammed Faisal',  email: 'valet@valetos.com',     phone: '+91 98100 00001', rating: 4.7, status: 'active',   assignedSpot: 'ENT-A', completedPickups: 142 },
  { id: 'VAL-002', name: 'Rakesh Yadav',     email: 'rakesh@valetos.com',    phone: '+91 98100 00002', rating: 4.5, status: 'active',   assignedSpot: 'ENT-B', completedPickups: 118 },
  { id: 'VAL-003', name: 'Aman Tiwari',      email: 'aman@valetos.com',      phone: '+91 98100 00003', rating: 4.8, status: 'active',   assignedSpot: 'LOBBY', completedPickups: 167 },
  { id: 'VAL-004', name: 'Suresh Pawar',     email: 'suresh@valetos.com',    phone: '+91 98100 00004', rating: 4.3, status: 'break',    assignedSpot: 'BREAK', completedPickups:  94 },
  { id: 'VAL-005', name: 'Deepak Chauhan',   email: 'deepak@valetos.com',    phone: '+91 98100 00005', rating: 4.6, status: 'active',   assignedSpot: 'ENT-C', completedPickups: 121 },
];

const admins = [
  { id: 'ADM-001', name: 'Atharv Founder', email: 'admin@valetos.com', phone: '+91 99000 00001' },
];

// --- Vehicles ----------------------------------------------------------------
// Realistic Indian plate formats, mix of brands/colors, parked at known spots.
// 10 of the 50 spots are pre-occupied; the rest are 'available'.
const PLATE_PREFIX = ['MH', 'DL', 'KA', 'TN', 'GJ', 'UP'];
const BRANDS = [
  { brand: 'Maruti Suzuki',  model: 'Swift',        color: 'White'  },
  { brand: 'Hyundai',        model: 'Creta',        color: 'Silver' },
  { brand: 'Tata',           model: 'Nexon',        color: 'Blue'   },
  { brand: 'Honda',          model: 'City',         color: 'Black'  },
  { brand: 'Toyota',         model: 'Innova Crysta',color: 'White'  },
  { brand: 'Kia',            model: 'Seltos',       color: 'Red'    },
  { brand: 'Mahindra',       model: 'XUV700',       color: 'Grey'   },
  { brand: 'BMW',            model: '3 Series',     color: 'Black'  },
  { brand: 'Mercedes-Benz',  model: 'C-Class',     color: 'White'  },
  { brand: 'Audi',           model: 'Q5',           color: 'Silver' },
];

function randPlate(i) {
  const state = PLATE_PREFIX[i % PLATE_PREFIX.length];
  const num   = String(1000 + ((i * 37) % 9000));
  const alpha = String.fromCharCode(65 + (i % 26)) + String.fromCharCode(65 + ((i * 3) % 26));
  return `${state}-${num}-${alpha}`;
}

function minutesAgo(min) {
  return new Date(Date.now() - min * 60_000).toISOString();
}

const vehicles = [];
for (let i = 0; i < 10; i += 1) {
  const spot = spots[i]; // pre-occupy first 10 spots
  const v = BRANDS[i % BRANDS.length];
  const customer = customers[i % customers.length];
  const valet    = valets[i % valets.length];
  const parkedAt = minutesAgo(15 + i * 23);
  vehicles.push({
    id: `VEH-${String(i + 1).padStart(3, '0')}`,
    plate: randPlate(i + 1),
    brand: v.brand,
    model: v.model,
    color: v.color,
    customerId: customer.id,
    customerName: customer.name,
    valetId: valet.id,
    valetName: valet.name,
    spotId: spot.id,
    spotNumber: spot.number,
    floor: spot.floor,
    qrCode: spot.qrCode,
    parkedAt,
    images: [`/uploads/placeholder-${(i % 3) + 1}.jpg`],
    status: 'parked', // parked | retrieving | delivered
  });
  spot.status = 'occupied';
  spot.vehicleId = vehicles[vehicles.length - 1].id;
}

// --- Pickup requests ---------------------------------------------------------
const pickupRequests = [
  {
    id: 'PU-1001',
    vehicleId: vehicles[0].id,
    plate: vehicles[0].plate,
    customerId: vehicles[0].customerId,
    customerName: vehicles[0].customerName,
    spotId: vehicles[0].spotId,
    spotNumber: vehicles[0].spotNumber,
    valetId: vehicles[0].valetId,
    valetName: vehicles[0].valetName,
    status: 'Requested',
    requestedAt: minutesAgo(4),
    estimatedReadyAt: new Date(Date.now() + 5 * 60_000).toISOString(),
  },
  {
    id: 'PU-1002',
    vehicleId: vehicles[1].id,
    plate: vehicles[1].plate,
    customerId: vehicles[1].customerId,
    customerName: vehicles[1].customerName,
    spotId: vehicles[1].spotId,
    spotNumber: vehicles[1].spotNumber,
    valetId: vehicles[1].valetId,
    valetName: vehicles[1].valetName,
    status: 'Assigned',
    requestedAt: minutesAgo(8),
    assignedAt:   minutesAgo(7),
    estimatedReadyAt: new Date(Date.now() + 3 * 60_000).toISOString(),
  },
  {
    id: 'PU-1003',
    vehicleId: vehicles[2].id,
    plate: vehicles[2].plate,
    customerId: vehicles[2].customerId,
    customerName: vehicles[2].customerName,
    spotId: vehicles[2].spotId,
    spotNumber: vehicles[2].spotNumber,
    valetId: vehicles[2].valetId,
    valetName: vehicles[2].valetName,
    status: 'Retrieving',
    requestedAt: minutesAgo(11),
    assignedAt:   minutesAgo(10),
    startedAt:    minutesAgo(2),
    estimatedReadyAt: new Date(Date.now() + 1 * 60_000).toISOString(),
  },
];

// --- Incidents ---------------------------------------------------------------
const incidents = [
  {
    id: 'INC-501',
    type: 'Scratch',
    vehicleId: vehicles[3].id,
    plate: vehicles[3].plate,
    customerId: vehicles[3].customerId,
    customerName: vehicles[3].customerName,
    reportedBy: 'VAL-002',
    reportedByName: 'Rakesh Yadav',
    description: 'Minor scratch on rear-left bumper noticed during check-in.',
    severity: 'low',
    status: 'open',
    createdAt: minutesAgo(180),
  },
  {
    id: 'INC-502',
    type: 'Customer Complaint',
    vehicleId: vehicles[4].id,
    plate: vehicles[4].plate,
    customerId: vehicles[4].customerId,
    customerName: vehicles[4].customerName,
    reportedBy: 'MGR-001',
    reportedByName: 'Rajesh Khanna',
    description: 'Customer reported delay of 8 minutes during peak hours.',
    severity: 'medium',
    status: 'in_review',
    createdAt: minutesAgo(420),
  },
  {
    id: 'INC-503',
    type: 'Lost Item',
    vehicleId: vehicles[5].id,
    plate: vehicles[5].plate,
    customerId: vehicles[5].customerId,
    customerName: vehicles[5].customerName,
    reportedBy: 'CUST-006',
    reportedByName: 'Neha Verma',
    description: 'Sunglasses left on dashboard — found and returned.',
    severity: 'low',
    status: 'resolved',
    createdAt: minutesAgo(720),
  },
];

// --- Movement history (audit trail) ------------------------------------------
const movements = vehicles.map((v, i) => ({
  id: uuid(),
  vehicleId: v.id,
  plate: v.plate,
  fromSpotId: null,
  toSpotId: v.spotId,
  toSpotNumber: v.spotNumber,
  valetId: v.valetId,
  valetName: v.valetName,
  reason: 'Initial check-in',
  at: v.parkedAt,
}));

// --- Push each new id counter high so the runtime never collides ------------
let _idCounter = 1;
function nextId(prefix) {
  _idCounter += 1;
  return `${prefix}-${String(Date.now()).slice(-6)}${String(_idCounter).padStart(3, '0')}`;
}

module.exports = {
  // layout
  floors,
  spots,
  // people
  customers,
  managers,
  valets,
  admins,
  // ops
  vehicles,
  pickupRequests,
  incidents,
  movements,
  // helpers
  nextId,
  uuid,
};
