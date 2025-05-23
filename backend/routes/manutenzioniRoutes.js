const express = require('express');
const router = express.Router();
const manutenzioniController = require('../controllers/manutenzioniController');

// Operazione 4.a - Inserimento: registrazione di un intervento tecnico per un veicolo
router.post('/', manutenzioniController.insertManutenzione);

// Operazione 4.b - Ricerca: visualizzazione storico manutenzioni per un veicolo
router.get('/veicolo/:veicoloId', manutenzioniController.getManutenzioniByVehicle);

module.exports = router; 