const express = require('express');
const router = express.Router();
const stazioniRicaricaController = require('../controllers/stazioniRicaricaController');

// Operazione 7.a - Inserimento: aggiunta di una nuova stazione di ricarica
router.post('/', stazioniRicaricaController.insertStazioneRicarica);

// Operazione 7.b - Modifica: aggiornamento dello stato della colonnina
router.put('/:id/stato', stazioniRicaricaController.updateStatoStazione);

// Op 7.c - Visualizzazione energia totale erogata da una stazione
router.get('/energia-totale', stazioniRicaricaController.getEnergiaTotale);

// Op 7.d - Visualizzazione durata media delle sessioni per stazione
router.get('/durata-media', stazioniRicaricaController.getDurataMediaSessioni);

module.exports = router; 