const express = require('express');
const router = express.Router();
const manutenzioniController = require('../controllers/manutenzioniController');

// Operazioni per gli interventi tecnici
router.post('/interventi', manutenzioniController.insertIntervento);
router.get('/interventi/veicolo/:veicoloId', manutenzioniController.getInterventiByVehicle);

// Operazioni per le revisioni
router.post('/revisioni', manutenzioniController.insertRevisione);
router.get('/revisioni/veicolo/:veicoloId', manutenzioniController.getRevisioniByVehicle);

module.exports = router;