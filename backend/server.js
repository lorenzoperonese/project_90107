const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { testConnection } = require('./config/database');
const vehicleRoutes = require('./routes/vehicleRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/api/veicoli', vehicleRoutes);

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
