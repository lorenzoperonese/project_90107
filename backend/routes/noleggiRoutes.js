const express = require('express');
const router = express.Router();
const noleggiController = require('../controllers/noleggiController');

// Operazione 2.a - Inserimento: avvio di un nuovo noleggio da parte di un cliente
router.post('/start', noleggiController.startNoleggio);

// Operazione 2.b - Modifica: aggiornamento dati alla conclusione del noleggio
router.put('/:id/end', noleggiController.endNoleggio);

// Operazione 2.c - Ricerca: visualizzare lo storico dei noleggi per utente
router.get('/cliente/:clienteId', noleggiController.getNoleggiByUser);

module.exports = router; 