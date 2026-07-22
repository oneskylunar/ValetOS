// Fake auth: returns a base64 "JWT" string. No validation, no expiry, no signing.
const store = require('../data/store');
const { ok, fail } = require('../middleware/response');

function fakeJwt(user) {
  // Header.payload.signature — payload is the part the frontend will read.
  const header  = Buffer.from(JSON.stringify({ alg: 'none', typ: 'JWT' })).toString('base64url');
  const payload = Buffer.from(JSON.stringify({
    sub: user.id,
    role: user.role,
    name: user.name,
    email: user.email,
    iat: Math.floor(Date.now() / 1000),
  })).toString('base64url');
  const sig = 'demo'; // intentionally not a real signature
  return `${header}.${payload}.${sig}`;
}

function login(req, res) {
  const { email, password } = req.body || {};
  if (!email || !password) return fail(res, 400, 'email and password are required');

  const user = store.users.find(u => u.email.toLowerCase() === String(email).toLowerCase());
  if (!user || user.password !== password) {
    return fail(res, 401, 'Invalid credentials');
  }

  const token = fakeJwt(user);
  return ok(res, {
    token,
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  }, 'Logged in');
}

function logout(req, res) {
  // No session to invalidate — fake auth is stateless.
  return ok(res, { loggedOut: true }, 'Logged out');
}

function me(req, res) {
  // Reads the fake JWT the client sent and echoes back the user.
  // This is purely cosmetic so the frontend can show "who am I".
  const auth = req.headers.authorization || '';
  const parts = auth.replace(/^Bearer\s+/i, '').split('.');
  if (parts.length !== 3) return fail(res, 401, 'Missing or malformed token');
  try {
    const payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf8'));
    return ok(res, payload, 'OK');
  } catch (e) {
    return fail(res, 401, 'Invalid token');
  }
}

module.exports = { login, logout, me };
