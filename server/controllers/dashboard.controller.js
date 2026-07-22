const store = require('../data/store');
const { ok, fail } = require('../middleware/response');

function getDashboard(req, res) {
  const totalSpots    = store.spots.length;
  const occupiedSpots = store.spots.filter(s => s.status === 'occupied').length;
  const availableSpots = totalSpots - occupiedSpots;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const vehiclesToday = store.vehicles.filter(v => new Date(v.parkedAt) >= today).length;

  const activeValets = store.valets.filter(v => v.status === 'active').length;
  const pendingPickups = store.pickupRequests.filter(p => p.status !== 'Delivered').length;
  const occupancyPct = totalSpots ? Math.round((occupiedSpots / totalSpots) * 100) : 0;

  return ok(res, {
    totalSpots,
    occupiedSpots,
    availableSpots,
    occupancyPct,
    activeValets,
    pendingPickups,
    vehiclesToday,
    openIncidents: store.incidents.filter(i => i.status !== 'resolved').length,
    recentVehicles: store.vehicles
      .slice()
      .sort((a, b) => new Date(b.parkedAt) - new Date(a.parkedAt))
      .slice(0, 5),
  }, 'Dashboard summary');
}

module.exports = { getDashboard };
