const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { testConnection } = require('./config/database');

// Import all route files
const vehicleRoutes = require('./routes/vehicleRoutes');
const rentalRoutes = require('./routes/rentalRoutes');
const clientRoutes = require('./routes/clientRoutes');
const maintenanceRoutes = require('./routes/maintenanceRoutes');
const chargeRoutes = require('./routes/chargeRoutes');
const chargingCenterRoutes = require('./routes/chargingCenterRoutes');
const chargingStationRoutes = require('./routes/chargingStationRoutes');
const fareRoutes = require('./routes/fareRoutes');
const fs = require('fs');
const path = require('path');
const morgan = require('morgan');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const accessLogStream = fs.createWriteStream(
  path.join(__dirname, 'access.log'), 
  { flags: 'a' }
);

// Middleware per loggare anche il body
morgan.token('body', (req) => JSON.stringify(req.body));

// Configura morgan
app.use(morgan(':date[iso] :method :url :status - :response-time ms :body', {
  stream: accessLogStream
}));

// API Routes
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/rentals', rentalRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/maintenances', maintenanceRoutes);
app.use('/api/charges', chargeRoutes);
app.use('/api/charging-centers', chargingCenterRoutes);
app.use('/api/charging-stations', chargingStationRoutes);
app.use('/api/fares', fareRoutes);



// Route test
app.get('/api', (req, res) => {
  res.send('API in esecuzione');
});

// Avvio del server
const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  console.log(`Server in ascolto sulla porta ${PORT}`);
  
  await testConnection();
});
