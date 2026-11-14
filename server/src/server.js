const app = require('./app');
const env = require('./config/env');
const { verifyDbConnection } = require('./config/db');

async function startServer() {
  try {
    await verifyDbConnection();
    app.listen(env.port, () => {
      console.log(`Express server running on http://localhost:${env.port}`);
    });
  } catch (err) {
    console.error('Failed to connect to MySQL on startup:', err.message);
    process.exit(1);
  }
}

startServer();