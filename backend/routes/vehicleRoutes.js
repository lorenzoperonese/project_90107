const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicleController');

// Operazione 1.a - Inserimento: aggiunta di un veicolo alla flotta
router.post('/', vehicleController.insertVehicle);

// Operazione 1.b - Modifica: aggiornamento dei dati dello stato del veicolo
router.put('/:id/state', vehicleController.updateVehicleState);

// Operazione 1.c - Cancellazione: rimozione di un veicolo dalla flotta
router.delete('/:id', vehicleController.deleteVehicle);

// Operazione 1.d - Ricerca1: visualizzazione dei dettagli di un veicolo per targa
router.get('/targa/:targa', vehicleController.getVehicleByTarga);

// Operazione 1.e - Ricerca2: visualizzazione veicoli per tipologia con batteria > 20%
router.get('/tipologia/:tipologia', vehicleController.getVehiclesByTypeAndBattery);

module.exports = router; 