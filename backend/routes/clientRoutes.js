const express = require('express');
const router = express.Router();
const clientiController = require('../controllers/clientController');

// Operazione 3.a - Inserimento: registrazione di un nuovo utente al servizio
router.post('/register', clientiController.registerCliente);

// Operazione 3.c - Modifica2: aggiornamento dei dati relativi alla patente
router.put('/:id/license', clientiController.updateLicenseData);

// Operazione 3.d - Cancellazione: rimozione dell'account utente
router.delete('/:id', clientiController.deleteCliente);

// Op 3.b: Visualizzazione dei clienti con più di 50 noleggi nell'ultimo anno
router.get('/frequent', clientiController.getFrequentClients);

// OP 3.c: Visualizzazione dei clienti con abbonamento attivo
router.get('/subscribers', clientiController.getClientsWithSubscription);

// Op 3.d: Visualizzazione dei clienti più fedeli
router.get('/loyal', clientiController.getLoyalClients);

module.exports = router; 