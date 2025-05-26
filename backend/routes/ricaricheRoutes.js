const express = require('express');
const router = express.Router();
const ricaricheController = require('../controllers/ricaricheController');

// Operazione 5.a - Inserimento: registrazione inizio di una nuova sessione di ricarica
router.post('/start', ricaricheController.startRicarica);

// Operazione 5.b - Modifica: aggiornamento dati al termine della sessione
router.put('/:id/end', ricaricheController.endRicarica);

// Veicoli che hanno effettuato più ricariche nell'ultimo mese
router.get('/veicoli-piu-ricaricati', ricaricheController.getVeicoliPiuRicaricati);

// Operatori che hanno effettuato più ricariche
router.get('/operatori-piu-attivi', ricaricheController.getOperatoriPiuAttivi);

module.exports = router; 