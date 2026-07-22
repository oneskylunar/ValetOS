const store = require('../data/store');
const { ok, fail } = require('../middleware/response');

function listValets(req, res) {
  return ok(res, { total: store.valets.length, valets: store.valets }, 'Valets');
}

function getValet(req, res) {
  const v = store.valets.find(x => x.id === req.params.id);
  if (!v) return fail(res, 404, 'Valet not found');
  const vehicles = store.vehicles.filter(x => x.valetId === v.id);
  const pickups  = store.pickupRequests.filter(p => p.valetId === v.id);
  return ok(res, { ...v, vehicles, pickups }, 'Valet details');
}

function listCustomers(req, res) {
  return ok(res, { total: store.customers.length, customers: store.customers }, 'Customers');
}

function listIncidents(req, res) {
  const { status, severity } = req.query;
  let result = store.incidents.slice();
  if (status)   result = result.filter(i => i.status === status);
  if (severity) result = result.filter(i => i.severity === severity);
  result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  return ok(res, { total: result.length, incidents: result }, 'Incidents');
}

function createIncident(req, res) {
  const { type, vehicleId, description, severity, reportedBy } = req.body || {};
  if (!type || !description) return fail(res, 400, 'type and description are required');

  const v = vehicleId ? store.vehicles.find(x => x.id === vehicleId) : null;
  const customer = v ? store.customers.find(c => c.id === v.customerId) : null;
  const reporter = store.valets.find(x => x.id === reportedBy)
                || store.managers.find(x => x.id === reportedBy)
                || { id: reportedBy || 'GUEST', name: 'Guest' };

  const incident = {
    id: store.nextId('INC'),
    type,
    vehicleId: v ? v.id : null,
    plate: v ? v.plate : null,
    customerId: customer ? customer.id : null,
    customerName: customer ? customer.name : null,
    reportedBy: reporter.id,
    reportedByName: reporter.name,
    description,
    severity: severity || 'low',
    status: 'open',
    createdAt: new Date().toISOString(),
  };

  store.incidents.push(incident);
  const io = global.__VALETOS_IO__;
  if (io) io.emit('incident:created', incident);
  return ok(res, incident, 'Incident reported');
}

module.exports = {
  listValets, getValet,
  listCustomers,
  listIncidents, createIncident,
};
