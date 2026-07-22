const store = require('../data/store');
const { ok, fail } = require('../middleware/response');

function listSpots(req, res) {
  const { floor, status, type } = req.query;
  let result = store.spots.slice();

  if (floor)  result = result.filter(s => s.floor === String(floor).toUpperCase());
  if (status) result = result.filter(s => s.status === status);
  if (type)   result = result.filter(s => s.type === type);

  return ok(res, {
    floors: store.floors,
    total: result.length,
    spots: result,
  }, 'Parking spots');
}

function getSpot(req, res) {
  const spot = store.spots.find(s => s.id === req.params.id);
  if (!spot) return fail(res, 404, 'Spot not found');
  const vehicle = spot.vehicleId ? store.vehicles.find(v => v.id === spot.vehicleId) : null;
  return ok(res, { ...spot, vehicle }, 'Spot details');
}

module.exports = { listSpots, getSpot };
