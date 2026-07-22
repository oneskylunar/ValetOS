const store = require('../data/store');
const { ok, fail } = require('../middleware/response');

function broadcast(event, payload) {
  const io = global.__VALETOS_IO__;
  if (io) io.emit(event, payload);
}

const VALID = new Set(['Requested', 'Assigned', 'Retrieving', 'Delivered']);

function listPickup(req, res) {
  const { status } = req.query;
  let result = store.pickupRequests.slice();
  if (status) result = result.filter(p => p.status === status);
  result.sort((a, b) => new Date(b.requestedAt) - new Date(a.requestedAt));
  return ok(res, { total: result.length, requests: result }, 'Pickup requests');
}

function createPickup(req, res) {
  const { vehicleId, customerId, spotId } = req.body || {};
  if (!vehicleId && !spotId) return fail(res, 400, 'vehicleId or spotId is required');

  const v = vehicleId
    ? store.vehicles.find(x => x.id === vehicleId)
    : store.vehicles.find(x => x.spotId === spotId || x.spotNumber === spotId);

  if (!v) return fail(res, 404, 'Vehicle not found at that spot');

  // If there's already a non-delivered pickup for this vehicle, return it.
  const existing = store.pickupRequests.find(p => p.vehicleId === v.id && p.status !== 'Delivered');
  if (existing) return ok(res, existing, 'Pickup already in progress');

  const customer = store.customers.find(c => c.id === (customerId || v.customerId));
  const request = {
    id: store.nextId('PU'),
    vehicleId: v.id,
    plate: v.plate,
    customerId: customer ? customer.id : v.customerId,
    customerName: customer ? customer.name : v.customerName,
    spotId: v.spotId,
    spotNumber: v.spotNumber,
    valetId: v.valetId,
    valetName: v.valetName,
    status: 'Requested',
    requestedAt: new Date().toISOString(),
    estimatedReadyAt: new Date(Date.now() + 7 * 60_000).toISOString(),
  };

  store.pickupRequests.push(request);
  v.status = 'retrieving';
  broadcast('pickup:requested', request);
  return ok(res, request, 'Pickup requested');
}

function updatePickupStatus(req, res) {
  const { status } = req.body || {};
  if (!VALID.has(status)) return fail(res, 400, `status must be one of: ${[...VALID].join(', ')}`);

  const request = store.pickupRequests.find(p => p.id === req.params.id);
  if (!request) return fail(res, 404, 'Pickup request not found');

  const now = new Date().toISOString();
  request.status = status;
  if (status === 'Assigned')   request.assignedAt = now;
  if (status === 'Retrieving') request.startedAt = now;
  if (status === 'Delivered')  request.deliveredAt = now;

  const v = store.vehicles.find(x => x.id === request.vehicleId);
  if (v) {
    if (status === 'Delivered') {
      v.status = 'delivered';
      const spot = store.spots.find(s => s.id === v.spotId);
      if (spot) { spot.status = 'available'; delete spot.vehicleId; }
    } else if (status === 'Retrieving') {
      v.status = 'retrieving';
    }
  }

  broadcast('pickup:updated', request);
  return ok(res, request, 'Pickup status updated');
}

module.exports = { listPickup, createPickup, updatePickupStatus };
