const express = require('express');
const router = express.Router();
const tariffeController = require('../controllers/rateController');

// Operazione 8.a - Modifica: modifica della tariffa per categoria di veicolo
router.put('/:category', tariffeController.updateTariffa);

module.exports = router; 