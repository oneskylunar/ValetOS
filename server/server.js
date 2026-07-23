// ValetOS backend entry point.
// Spins up the HTTP server, attaches Socket.IO for live updates, and
// stashes the io instance on `global.__VALETOS_IO__` so controllers can
// broadcast without importing server-side socket boilerplate everywhere.
const http = require('http');
const { Server } = require('socket.io');
const { buildApp } = require('./app');

const PORT = process.env.PORT || 4000;

const app    = buildApp();
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: true, credentials: true },
  // Long-poll fallback for restrictive networks; websocket is the default.
  transports: ['websocket', 'polling'],
});

global.__VALETOS_IO__ = io;

io.on('connection', (socket) => {
  console.log(`[socket] connected: ${socket.id}`);
  // Greet the client so they can confirm the channel is open.
  socket.emit('hello', { message: 'ValetOS live feed connected', ts: new Date().toISOString() });
  socket.on('disconnect', () => console.log(`[socket] disconnected: ${socket.id}`));
});

server.listen(PORT, () => {
  console.log(`🚗 ValetOS API listening on http://localhost:${PORT}`);
  console.log(`   Health:    GET  http://localhost:${PORT}/health`);
  console.log(`   Dashboard: GET  http://localhost:${PORT}/dashboard`);
  console.log(`   Uploads:   /uploads/*  (static)`);
  console.log(`   Sockets:   ws://localhost:${PORT}`);
});

module.exports = { app, server, io };
