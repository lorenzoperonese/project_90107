const express = require('express');
const router = express.Router();
const centriRicaricaController = require('../controllers/centriRicaricaController');

// Operazione 6.a - Inserimento: aggiunta di un nuovo centro di ricarica
router.post('/', centriRicaricaController.insertCentroRicarica);

// Operazione 6.b - Cancellazione: rimozione di un centro di ricarica
router.delete('/:indirizzo', centriRicaricaController.deleteCentroRicarica);

// Operazione 6.c - Ricerca1: visualizzazione centro per zona geografica
router.get('/zona/:zona', centriRicaricaController.getCentriByZona);

// Operazione 6.d - Ricerca2: visualizzazione centro per servizi accessori
router.get('/servizi/:servizio', centriRicaricaController.getCentriByServizi);

module.exports = router; 