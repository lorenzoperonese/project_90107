const express = require('express');
const router = express.Router();
const stazioniRicaricaController = require('../controllers/stazioniRicaricaController');

// Operazione 7.a - Inserimento: aggiunta di una nuova stazione di ricarica
router.post('/', stazioniRicaricaController.insertStazioneRicarica);

// Operazione 7.b - Modifica: aggiornamento dello stato della colonnina
router.put('/:id/stato', stazioniRicaricaController.updateStatoStazione);

// Operazione 7.c - Cancellazione: rimozione di una stazione
router.delete('/:id', stazioniRicaricaController.deleteStazioneRicarica);

// Operazione 7.d - Ricerca: visualizzazione colonnine per zona geografica
router.get('/zona/:zona', stazioniRicaricaController.getStazioniByZona);

module.exports = router; 