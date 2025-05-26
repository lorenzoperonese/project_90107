const express = require('express');
const router = express.Router();
const noleggiController = require('../controllers/rentalControllers');

// Operazione 2.a - Inserimento: avvio di un nuovo noleggio da parte di un cliente
router.post('/start', noleggiController.startNoleggio);

// Operazione 2.b - Modifica: aggiornamento dati alla conclusione del noleggio
router.put('/:id/end', noleggiController.endNoleggio);

// Operazione 2.d - Visualizzazione della durata media dei noleggi per ogni tipologia
router.get('/average-duration', noleggiController.getDurataMediaPerTipologia);

// Operazione 2.e - Visualizzazione dei veicoli con più chilometri percorsi
router.get('/most-km-vehicles', noleggiController.getVeicoliConPiuKm);

// Operazione 2.f - Visualizzazione andamento mensile dei noleggi
router.get('/monthly-trend', noleggiController.getAndamentoMensile);

module.exports = router; 