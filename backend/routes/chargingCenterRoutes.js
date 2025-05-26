const express = require('express');
const router = express.Router();
const centriRicaricaController = require('../controllers/chargingCenterController');

// Operazione 6.a - Inserimento: aggiunta di un nuovo centro di ricarica
router.post('/', centriRicaricaController.insertCentroRicarica);

// Op 6.c: Visualizzazione dei 5 centri di ricarica con più ricariche effettuate nell'ultimo anno
router.get('/most-active', centriRicaricaController.getCentriPiuAttivi);

// Op 6.b: Visualizzazione energia totale ricaricata per centro di ricarica
router.get('/total-energy', centriRicaricaController.getEnergiaTotale);

module.exports = router; 