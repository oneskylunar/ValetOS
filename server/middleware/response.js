// Tiny helpers shared across controllers.

function ok(res, data, message = 'Operation successful') {
  return res.json({ success: true, message, data });
}

function fail(res, status, message, data = null) {
  return res.status(status).json({ success: false, message, data });
}

function asyncHandler(fn) {
  // Express 4 doesn't await async handlers; wrap to forward errors.
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
}

module.exports = { ok, fail, asyncHandler };
