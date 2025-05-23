const express = require('express');
const router = express.Router();
const clientiController = require('../controllers/clientiController');

// Operazione 3.a - Inserimento: registrazione di un nuovo utente al servizio
router.post('/register', clientiController.registerCliente);

// Operazione 3.b - Modifica1: aggiornamento dei dati di pagamento
router.put('/:id/payment', clientiController.updatePaymentData);

// Operazione 3.c - Modifica2: aggiornamento dei dati relativi alla patente
router.put('/:id/license', clientiController.updateLicenseData);

// Operazione 3.d - Cancellazione: rimozione dell'account utente
router.delete('/:id', clientiController.deleteCliente);

// Operazione 3.e - Ricerca: visualizzazione dettagli di un utente per ID
router.get('/:id', clientiController.getClienteById);

module.exports = router; 