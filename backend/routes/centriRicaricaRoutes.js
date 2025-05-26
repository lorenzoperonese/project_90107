const express = require('express');
const router = express.Router();
const centriRicaricaController = require('../controllers/centriRicaricaController');

// Operazione 6.a - Inserimento: aggiunta di un nuovo centro di ricarica
router.post('/', centriRicaricaController.insertCentroRicarica);

// Operazione 6.b - Cancellazione: rimozione di un centro di ricarica
router.delete('/:indirizzo', centriRicaricaController.deleteCentroRicarica);

// Operazione 6.c - Ricerca1: visualizzazione centro per zona geografica
router.get('/', centriRicaricaController.getCentri);

// Operazione 6.d - Ricerca2: visualizzazione veicoli caricati in un centro di ricarica
router.get('/:indirizzo/veicoli', centriRicaricaController.getVehiclesByChargingCenter);

module.exports = router; 