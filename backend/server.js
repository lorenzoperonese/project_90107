const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { testConnection } = require('./config/database');

// Import all route files
const vehicleRoutes = require('./routes/vehicleRoutes');
const noleggiRoutes = require('./routes/noleggiRoutes');
const clientiRoutes = require('./routes/clientiRoutes');
const manutenzioniRoutes = require('./routes/manutenzioniRoutes');
const ricaricheRoutes = require('./routes/ricaricheRoutes');
const centriRicaricaRoutes = require('./routes/centriRicaricaRoutes');
const stazioniRicaricaRoutes = require('./routes/stazioniRicaricaRoutes');
const tariffeRoutes = require('./routes/tariffeRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/veicoli', vehicleRoutes);
app.use('/api/noleggi', noleggiRoutes);
app.use('/api/clienti', clientiRoutes);
app.use('/api/manutenzioni', manutenzioniRoutes);
app.use('/api/ricariche', ricaricheRoutes);
app.use('/api/centri-ricarica', centriRicaricaRoutes);
app.use('/api/stazioni-ricarica', stazioniRicaricaRoutes);
app.use('/api/tariffe', tariffeRoutes);

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
