const express = require('express');
const router = express.Router();
const manutenzioniController = require('../controllers/manutenzioniController');

// Operazione: inserimento di un intervento (manutenzione o revisione)
router.post('/', manutenzioniController.insertIntervento);

// Operazione 4.b - Visualizzazione tipologie di intervento più costose in media
router.get('/costi-medi', manutenzioniController.getCostiMedi);

// Operazione 4.c - Andamento mensile dei costi di manutenzione
router.get('/andamento-mensile', manutenzioniController.getAndamentoMensile);

// Visualizzazione dei noleggi effettuati prima di un intervento
router.get('/intervento/:interventoId/clienti', manutenzioniController.getNoleggiBeforeIntervento);

module.exports = router;