const express = require('express');
const router = express.Router();
const manutenzioniController = require('../controllers/manutenzioniController');

// Operazione: inserimento di un intervento (manutenzione o revisione)
router.post('/', manutenzioniController.insertIntervento);

// Operazione: visualizzazione degli ultimi 5 clienti che hanno noleggiato veicoli con interventi
router.get('/veicolo/:veicoloId/clienti', manutenzioniController.getLastClientsWithInterventions);

// Operazione: visualizzazione veicoli che hanno effettuato manutenzioni/revisioni presso una specifica officina
router.get('/officina/:officinaId/veicoli', manutenzioniController.getVehiclesByWorkshop);

module.exports = router;