const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicleController');

// Operazione 1.a - Inserimento: aggiunta di un veicolo alla flotta
router.post('/', vehicleController.insertVehicle);

// Operazione 1.b - Modifica: aggiornamento dei dati dello stato del veicolo
router.put('/:id/state', vehicleController.updateVehicleState);

// Operazione 1.c - Cancellazione: rimozione di un veicolo dalla flotta
router.delete('/:id', vehicleController.deleteVehicle);

// Operazione 1.e - Ricerca2: visualizzazione veicoli per tipologia con batteria > 20%
router.get('/type/:type', vehicleController.getVehiclesByTypeAndBattery);

// Operazione 1.f - Visualizzazione dei 5 veicoli più noleggiati nell'ultimo anno per tipologia
router.get('/most-rented/:type', vehicleController.getMostRentedVehiclesByType);

// Operazione 1.g - Visualizzazione dei 5 veicoli che hanno ricevuto più interventi di manutenzione nell'ultimo anno
router.get('/most-maintenance', vehicleController.getMostMaintenanceVehicles);

module.exports = router; 