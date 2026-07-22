const store = require('../data/store');
const { ok } = require('../middleware/response');

// All numbers here are hardcoded for the demo.
// They read from the live in-memory data where it makes sense (occupancy,
// today's vehicles) so the dashboard looks coherent even after check-ins.
function getAnalytics(req, res) {
  const total = store.spots.length;
  const occupied = store.spots.filter(s => s.status === 'occupied').length;
  const occupancyPct = total ? Math.round((occupied / total) * 100) : 0;

  const today = new Date(); today.setHours(0, 0, 0, 0);
  const vehiclesToday = store.vehicles.filter(v => new Date(v.parkedAt) >= today).length;

  const mostActive = store.valets
    .slice()
    .sort((a, b) => b.completedPickups - a.completedPickups)[0];

  // Hardcoded but believable shape — perfect for chart components.
  const occupancyByHour = [
    { hour: '08:00', pct: 18 }, { hour: '09:00', pct: 34 }, { hour: '10:00', pct: 52 },
    { hour: '11:00', pct: 61 }, { hour: '12:00', pct: 78 }, { hour: '13:00', pct: 84 },
    { hour: '14:00', pct: 76 }, { hour: '15:00', pct: 68 }, { hour: '16:00', pct: 72 },
    { hour: '17:00', pct: 81 }, { hour: '18:00', pct: 90 }, { hour: '19:00', pct: 88 },
    { hour: '20:00', pct: 64 }, { hour: '21:00', pct: 42 },
  ];

  const peakHour = occupancyByHour.reduce((a, b) => (a.pct > b.pct ? a : b));

  const averageRetrievalMinutes = 4.6;
  const averageParkingMinutes = 92;

  return ok(res, {
    occupancyPct,
    peakHour: peakHour.hour,
    peakOccupancyPct: peakHour.pct,
    averageRetrievalMinutes,
    averageParkingMinutes,
    vehiclesParkedToday: Math.max(vehiclesToday, 23),
    mostActiveValet: mostActive
      ? { id: mostActive.id, name: mostActive.name, pickups: mostActive.completedPickups }
      : null,
    occupancyByHour,
    floorBreakdown: store.floors.map(f => ({
      floor: f.id,
      name: f.name,
      total: f.total,
      occupied: store.spots.filter(s => s.floor === f.id && s.status === 'occupied').length,
    })),
    valetLeaderboard: store.valets
      .slice()
      .sort((a, b) => b.completedPickups - a.completedPickups)
      .map(v => ({ id: v.id, name: v.name, pickups: v.completedPickups, rating: v.rating })),
  }, 'Analytics');
}

module.exports = { getAnalytics };
