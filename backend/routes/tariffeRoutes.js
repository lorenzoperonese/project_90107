const express = require('express');
const router = express.Router();
const tariffeController = require('../controllers/tariffeController');

// Operazione 8.a - Modifica: modifica della tariffa per categoria di veicolo
router.put('/:categoria', tariffeController.updateTariffa);

module.exports = router; 