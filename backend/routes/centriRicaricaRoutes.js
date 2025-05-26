const express = require('express');
const router = express.Router();
const centriRicaricaController = require('../controllers/centriRicaricaController');

// Operazione 6.a - Inserimento: aggiunta di un nuovo centro di ricarica
router.post('/', centriRicaricaController.insertCentroRicarica);

// Op 6.c: Visualizzazione dei 5 centri di ricarica con più ricariche effettuate nell'ultimo anno
router.get('/piu-attivi', centriRicaricaController.getCentriPiuAttivi);

// Op 6.b: Visualizzazione energia totale ricaricata per centro di ricarica
router.get('/:id/energia-totale', centriRicaricaController.getEnergiaTotale);

module.exports = router; 