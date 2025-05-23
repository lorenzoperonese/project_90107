const express = require('express');
const router = express.Router();
const ricaricheController = require('../controllers/ricaricheController');

// Operazione 5.a - Inserimento: registrazione inizio di una nuova sessione di ricarica
router.post('/start', ricaricheController.startRicarica);

// Operazione 5.b - Modifica: aggiornamento dati al termine della sessione
router.put('/:id/end', ricaricheController.endRicarica);

// Operazione 5.c - Ricerca1: visualizzazione storico delle ricariche per veicolo
router.get('/veicolo/:veicoloId', ricaricheController.getRicaricheByVehicle);

// Operazione 5.d - Ricerca2: visualizzazione storico ricariche effettuate da un addetto
router.get('/operatore/:operatoreId', ricaricheController.getRicaricheByOperatore);

module.exports = router; 