const express = require('express');
const cors = require('cors');
const env = require('./config/env');
const healthRoutes = require('./routes/healthRoutes');
const urlRoutes = require('./routes/urlRoutes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// 1. Security & Parsing Middlewares
app.use(cors({ origin: env.clientUrl }));
app.use(express.json());

// 2. Routes (Specific routes first, wildcard redirect last)
app.use('/', healthRoutes);
app.use('/', urlRoutes);

// 3. Centralized Error Handler
app.use(errorHandler);

module.exports = app;