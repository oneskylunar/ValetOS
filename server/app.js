// Express app composition. server.js wraps this with http + socket.io.
const path = require('path');
const express = require('express');
const cors = require('cors');

const dashboardRoutes = require('./routes/dashboard.routes');
const spotsRoutes     = require('./routes/spots.routes');
const vehiclesRoutes  = require('./routes/vehicles.routes');
const pickupRoutes    = require('./routes/pickup.routes');
const valetsRoutes    = require('./routes/valets.routes');
const customersRoutes = require('./routes/customers.routes');
const incidentsRoutes = require('./routes/incidents.routes');
const analyticsRoutes = require('./routes/analytics.routes');

function buildApp() {
  const app = express();

  // CORS — wide open for the hackathon. Lock down in production.
  app.use(cors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  }));

  app.use(express.json({ limit: '2mb' }));
  app.use(express.urlencoded({ extended: true }));

  // Serve uploaded images at /uploads/*
  app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

  // Health check
  app.get('/health', (req, res) => res.json({
    success: true, message: 'ValetOS API is up',
    data: { uptime: process.uptime(), ts: new Date().toISOString() },
  }));

  // Mount routes
  app.use('/dashboard',  dashboardRoutes);
  app.use('/spots',      spotsRoutes);
  app.use('/vehicles',   vehiclesRoutes);
  app.use('/pickup',     pickupRoutes);
  app.use('/valets',     valetsRoutes);
  app.use('/customers',  customersRoutes);
  app.use('/incidents',  incidentsRoutes);
  app.use('/analytics',  analyticsRoutes);

  // 404
  app.use((req, res) => {
    res.status(404).json({ success: false, message: `Route not found: ${req.method} ${req.path}` });
  });

  // Error handler — last middleware.
  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    console.error('[error]', err);
    res.status(err.status || 500).json({
      success: false,
      message: err.message || 'Internal server error',
    });
  });

  return app;
}

module.exports = { buildApp };
