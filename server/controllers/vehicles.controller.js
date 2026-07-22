const store = require('../data/store');
const { ok, fail } = require('../middleware/response');

// In-memory broadcast bus. The server.js attaches a real Socket.IO
// instance to this; controllers just call `broadcast(event, payload)`.
function broadcast(event, payload) {
  const io = global.__VALETOS_IO__;
  if (io) io.emit(event, payload);
}

function host(req) {
  return `${req.protocol}://${req.get('host')}`;
}

function listVehicles(req, res) {
  const { status, customerId, valetId, floor } = req.query;
  let result = store.vehicles.slice();
  if (status)     result = result.filter(v => v.status === status);
  if (customerId) result = result.filter(v => v.customerId === customerId);
  if (valetId)    result = result.filter(v => v.valetId === valetId);
  if (floor)      result = result.filter(v => v.floor === String(floor).toUpperCase());

  return ok(res, { total: result.length, vehicles: result }, 'Vehicles');
}

function getVehicle(req, res) {
  const v = store.vehicles.find(x => x.id === req.params.id);
  if (!v) return fail(res, 404, 'Vehicle not found');
  const movements = store.movements
    .filter(m => m.vehicleId === v.id)
    .sort((a, b) => new Date(b.at) - new Date(a.at));
  return ok(res, { ...v, movements }, 'Vehicle details');
}

// POST /vehicles/checkin  (multipart/form-data, field: images)
function checkin(req, res) {
  const { plate, brand, model, color, customerId, valetId, spotId } = req.body || {};
  if (!plate || !spotId) return fail(res, 400, 'plate and spotId are required');

  const spot = store.spots.find(s => s.id === spotId || s.qrCode === spotId);
  if (!spot) return fail(res, 404, 'Spot not found');
  if (spot.status !== 'available') return fail(res, 409, `Spot ${spot.number} is not available`);

  const customer = store.customers.find(c => c.id === customerId) || store.customers[0];
  const valet    = store.valets.find(v => v.id === valetId)       || store.valets.find(v => v.status === 'active') || store.valets[0];

  const images = (req.files || []).map(f => `/uploads/${f.filename}`);

  const vehicle = {
    id: store.nextId('VEH'),
    plate: String(plate).toUpperCase(),
    brand: brand || 'Unknown',
    model: model || 'Unknown',
    color: color || 'Unspecified',
    customerId: customer.id,
    customerName: customer.name,
    valetId: valet.id,
    valetName: valet.name,
    spotId: spot.id,
    spotNumber: spot.number,
    floor: spot.floor,
    qrCode: spot.qrCode,
    parkedAt: new Date().toISOString(),
    images: images.length ? images : ['/uploads/placeholder-1.jpg'],
    status: 'parked',
  };

  store.vehicles.push(vehicle);
  spot.status = 'occupied';
  spot.vehicleId = vehicle.id;

  store.movements.push({
    id: store.uuid(),
    vehicleId: vehicle.id,
    plate: vehicle.plate,
    fromSpotId: null,
    toSpotId: spot.id,
    toSpotNumber: spot.number,
    valetId: valet.id,
    valetName: valet.name,
    reason: 'Check-in',
    at: vehicle.parkedAt,
  });

  broadcast('vehicle:parked', { vehicle, spot });

  const base = host(req);
  return ok(res, {
    ...vehicle,
    imageUrls: vehicle.images.map(p => p.startsWith('http') ? p : base + p),
  }, 'Vehicle checked in');
}

// PUT /vehicles/:id/move
function move(req, res) {
  const v = store.vehicles.find(x => x.id === req.params.id);
  if (!v) return fail(res, 404, 'Vehicle not found');

  const { spotId, reason, valetId } = req.body || {};
  if (!spotId) return fail(res, 400, 'spotId is required');

  const target = store.spots.find(s => s.id === spotId || s.qrCode === spotId);
  if (!target) return fail(res, 404, 'Target spot not found');
  if (target.status !== 'available') return fail(res, 409, `Spot ${target.number} is not available`);

  const oldSpot = store.spots.find(s => s.id === v.spotId);
  if (oldSpot) {
    oldSpot.status = 'available';
    delete oldSpot.vehicleId;
  }

  const mover = store.valets.find(x => x.id === valetId) || store.valets.find(x => x.id === v.valetId);

  v.spotId = target.id;
  v.spotNumber = target.number;
  v.floor = target.floor;
  v.qrCode = target.qrCode;
  v.valetId = mover ? mover.id : v.valetId;
  v.valetName = mover ? mover.name : v.valetName;

  target.status = 'occupied';
  target.vehicleId = v.id;

  store.movements.push({
    id: store.uuid(),
    vehicleId: v.id,
    plate: v.plate,
    fromSpotId: oldSpot ? oldSpot.id : null,
    toSpotId: target.id,
    toSpotNumber: target.number,
    valetId: v.valetId,
    valetName: v.valetName,
    reason: reason || 'Relocation',
    at: new Date().toISOString(),
  });

  broadcast('vehicle:moved', { vehicle: v, fromSpot: oldSpot || null, toSpot: target });
  return ok(res, v, 'Vehicle moved');
}

// POST /vehicles/:id/checkout
function checkout(req, res) {
  const v = store.vehicles.find(x => x.id === req.params.id);
  if (!v) return fail(res, 404, 'Vehicle not found');

  // Free the spot
  const spot = store.spots.find(s => s.id === v.spotId);
  if (spot) {
    spot.status = 'available';
    delete spot.vehicleId;
  }

  // Drop any open pickup request for this vehicle
  store.pickupRequests = store.pickupRequests.filter(p => p.vehicleId !== v.id || p.status === 'Delivered');

  v.status = 'delivered';
  v.deliveredAt = new Date().toISOString();

  broadcast('vehicle:delivered', { vehicle: v });
  return ok(res, v, 'Vehicle delivered');
}

module.exports = { listVehicles, getVehicle, checkin, move, checkout };
