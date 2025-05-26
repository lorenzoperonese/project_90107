const { pool } = require('../config/database');
const bcrypt = require('bcrypt');

const clientiController = {

  // DELETE /api/clienti/:id - Elimina cliente
  deleteCliente: async (req, res) => {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      
      const { id } = req.params;

      // Elimina Account
      const accountQuery = 'UPDATE Account_Attivo SET Stato = "eliminato" WHERE ID = ?';
      await connection.execute(accountQuery, [id]);
      await connection.commit();

      return res.status(200).json({
        success: true,
        message: 'Account cliente eliminato con successo',
        data: { AccountID: id }
      });
    } catch (error) {
      await connection.rollback();
      console.error('Errore durante l\'eliminazione del cliente:', error);
      return res.status(500).json({
        success: false,
        message: 'Errore durante l\'eliminazione del cliente',
        error: error.message
      });
    } finally {
      connection.release();
    }
  },

  // Operazione 3.a - Inserimento: registrazione di un nuovo utente al servizio
  registerCliente: async (req, res) => {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const {
        Nome,
        Cognome,
        DataNascita,
        LuogoNascita,
        IndirizzoResidenza,
        DocumentoNumero,
        DocumentoScadenza,
        EnteRilascioDocumento,
        Email,
        Password,
        Telefono
      } = req.body;

      console.log('Dati ricevuti per la creazione del cliente:', {
        Nome,
        Cognome,
        DataNascita,
        LuogoNascita,
        IndirizzoResidenza,
        DocumentoNumero,
        Email,
        Telefono
      });

      // Hash della password
      const hashedPassword = await bcrypt.hash(Password, 10);

      // Inserimento Account
      const accountQuery = `
        INSERT INTO Account (Email, Password, Telefono, Stato, Dipendente)
        VALUES (?, ?, ?, 'in_fase_di_verifica', FALSE)
      `;
      const [accountResult] = await connection.execute(accountQuery, [Email, hashedPassword, Telefono]);
      const accountId = accountResult.insertId;

      // Insert Documento
      const documentoQuery = `
        INSERT INTO Documento (Numero, Scadenza, EnteRilascio)
        VALUES (?, ?, ?)
      `;
      await connection.execute(documentoQuery, [
        DocumentoNumero, DocumentoScadenza, EnteRilascioDocumento
      ]);


      // Inserimento Cliente
      const clienteQuery = `
        INSERT INTO Cliente (
          AccountID, Nome, Cognome, DataNascita, LuogoNascita,
          IndirizzoResidenza, DocumentoNumero
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
      `;
      await connection.execute(clienteQuery, [
        accountId, Nome, Cognome, DataNascita, LuogoNascita,
        IndirizzoResidenza, DocumentoNumero
      ]);

      await connection.commit();

      return res.status(201).json({
        success: true,
        message: 'Cliente registrato con successo',
        data: {
          AccountID: accountId,
          Nome,
          Cognome,
          Email
        }
      });
    } catch (error) {
      await connection.rollback();
      console.error('Errore durante la registrazione del cliente:', error);
      
      return res.status(500).json({
        success: false,
        message: 'Errore durante la registrazione del cliente',
        error: error.message
      });
    } finally {
      connection.release();
    }
  },

  // Operazione 3.b - Modifica1: aggiornamento dei dati di pagamento
  updatePaymentData: async (req, res) => {
    try {
      const { id } = req.params;
      const { NumeroCarta, Intestatario, CVV, Scadenza } = req.body;
      console.log('Dati ricevuti per l\'aggiornamento del metodo di pagamento:', {
        NumeroCarta,
        Intestatario,
        CVV,
        Scadenza
      });

      const query = `INSERT INTO MetodoPagamento (NumeroCarta, Intestatario, CVV, Scadenza) 
                      VALUES (?, ?, ?, ?)`
      
      // Esegui l'inserimento o l'aggiornamento del metodo di pagamento
      const [result] = await pool.execute(query, [NumeroCarta, Intestatario, CVV, Scadenza]);

      const updateAccountQuery = `
        UPDATE Account_Attivo SET MetodoPagamento = ?
        WHERE ID = ?
      `;
      await pool.execute(updateAccountQuery, [NumeroCarta, id]);


      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: 'Cliente non trovato'
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Dati di pagamento aggiornati con successo',
        data: {
          AccountID: id,
          NumeroCarta,
          Intestatario,
          CVV,
          Scadenza
        }
      });
    } catch (error) {
      console.error('Errore durante l\'aggiornamento dei dati di pagamento:', error);
      return res.status(500).json({
        success: false,
        message: 'Errore durante l\'aggiornamento dei dati di pagamento',
        error: error.message
      });
    }
  },

  // Operazione 3.c - Modifica2: aggiornamento dei dati relativi alla patente
  updateLicenseData: async (req, res) => {
    try {
      const { id } = req.params;
      const { PatenteNumero, PatenteScadenza, PatenteEnteRilascio, PatenteDataRilascio, AB } = req.body;
      let AutoAbilitata = 0;
      if (AB === 'B') {
        AutoAbilitata = 1;
      }
      
      // Insert Patente
      const patenteQuery = `
        INSERT INTO Patente (Numero, Scadenza, EnteRilascio, DataRilascio, AutoAbilitata)
        VALUES (?, ?, ?, ?, ?)
      `;
      await pool.execute(patenteQuery, [PatenteNumero, PatenteScadenza, PatenteEnteRilascio, PatenteDataRilascio, AutoAbilitata]);
      
      const query = `UPDATE Cliente SET PatenteNumero = ? WHERE AccountID = ?`;
      const [result] = await pool.execute(query, [PatenteNumero, id]);

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: 'Cliente non trovato'
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Dati patente aggiornati con successo',
        data: {
          AccountID: id,
          PatenteNumero,
          PatenteScadenza,
          PatenteEnteRilascio,
          PatenteDataRilascio,
          AutoAbilitata
        }
      });
    } catch (error) {
      console.error('Errore durante l\'aggiornamento dei dati patente:', error);
      return res.status(500).json({
        success: false,
        message: 'Errore durante l\'aggiornamento dei dati patente',
        error: error.message
      });
    }
  },

  // Operazione 3.e - Ricerca: visualizzazione dettagli di un utente per ID
  getClienteById: async (req, res) => {
    try {
      const { id } = req.params;

      const query = `
        SELECT 
          c.AccountID, c.Nome, c.Cognome, c.DataNascita, c.LuogoNascita,
          c.IndirizzoResidenza, c.PatenteNumero, c.DocumentoNumero,
          a.Email, a.Telefono, a.Stato, a.DataRegistrazione
        FROM Cliente c
        JOIN Account a ON c.AccountID = a.ID
        WHERE c.AccountID = ?
      `;

      const [clienti] = await pool.execute(query, [id]);
      
      if (clienti.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Cliente non trovato'
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Dettagli cliente recuperati con successo',
        data: clienti[0]
      });
    } catch (error) {
      console.error('Errore durante il recupero del cliente:', error);
      return res.status(500).json({
        success: false,
        message: 'Errore durante il recupero del cliente',
        error: error.message
      });
    }
  }
};

module.exports = clientiController;