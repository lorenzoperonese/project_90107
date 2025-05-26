const express = require('express');
const router = express.Router();
const stazioniRicaricaController = require('../controllers/chargingStationController');

// Operazione 7.a - Inserimento: aggiunta di una nuova stazione di ricarica
router.post('/', stazioniRicaricaController.insertStazioneRicarica);

// Operazione 7.b - Modifica: aggiornamento dello stato della colonnina
router.put('/:id/state', stazioniRicaricaController.updateStatoStazione);

// Op 7.c - Visualizzazione energia totale erogata da una stazione
router.get('/total-energy', stazioniRicaricaController.getEnergiaTotale);

// Op 7.d - Visualizzazione durata media delle sessioni per stazione
router.get('/average-duration', stazioniRicaricaController.getDurataMediaSessioni);

module.exports = router; 