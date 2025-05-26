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
        Telefono,
        NumeroCarta,
        Scadenza,
        CVV,
        Intestatario
      } = req.body;

      console.log('Dati ricevuti per la creazione del cliente:', {
        Nome,
        Cognome,
        DataNascita,
        LuogoNascita,
        IndirizzoResidenza,
        DocumentoNumero,
        Email,
        Telefono,
        NumeroCarta
      });

      // Inserimento MetodoPagamento
      const metodoPagamentoQuery = `
        INSERT INTO MetodoPagamento (NumeroCarta, Intestatario, CVV, Scadenza) 
        VALUES (?, ?, ?, ?)
      `;
      await connection.execute(metodoPagamentoQuery, [NumeroCarta, Intestatario, CVV, Scadenza]);

      // Hash della password
      const hashedPassword = await bcrypt.hash(Password, 10);

      // Inserimento Account con il metodo di pagamento
      const accountQuery = `
        INSERT INTO Account (Email, Password, Telefono, Stato, Dipendente, MetodoPagamento)
        VALUES (?, ?, ?, 'in_fase_di_verifica', FALSE, ?)
      `;
      const [accountResult] = await connection.execute(accountQuery, [Email, hashedPassword, Telefono, NumeroCarta]);
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

      // Aggiorno lo stato dell'account ad attivo
      const updateAccountStatusQuery = `
        UPDATE Account_Attivo SET Stato = 'attivo' WHERE ID = ?
      `;
      await connection.execute(updateAccountStatusQuery, [accountId]);

      await connection.commit();

      return res.status(201).json({
        success: true,
        message: 'Cliente registrato con successo',
        data: {
          AccountID: accountId,
          Nome,
          Cognome,
          Email,
          MetodoPagamento: NumeroCarta
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

  // Op 3.b: Visualizzazione dei clienti con più di 50 noleggi nell'ultimo anno
  getFrequentClients: async (req, res) => {
    try {
      const query = `
        SELECT 
          c.AccountID,
          c.Nome,
          c.Cognome,
          COUNT(n.ID) AS NumeroNoleggi
        FROM Cliente c
        JOIN Noleggia n ON c.AccountID = n.ClienteAccountID
        WHERE n.DataInizio >= DATE_SUB(CURDATE(), INTERVAL 1 YEAR)
        GROUP BY c.AccountID, c.Nome, c.Cognome
        HAVING NumeroNoleggi > 50
      `;

      const [clients] = await pool.execute(query);
      
      return res.status(200).json({
        success: true,
        message: 'Clienti frequenti recuperati con successo',
        count: clients.length,
        data: clients
      });
    } catch (error) {
      console.error('Errore durante il recupero dei clienti frequenti:', error);
      return res.status(500).json({
        success: false,
        message: 'Errore durante il recupero dei clienti frequenti',
        error: error.message
      });
    }
  },

  // OP 3.c: Visualizzazione dei clienti con abbonamento attivo
  getClientsWithSubscription: async (req, res) => {
    try {
      const query = `
        SELECT 
          c.AccountID,
          c.Nome,
          c.Cognome,
          aa.TipoAbbonamento,
          aa.DataFineValidita
        FROM Cliente c
        JOIN Acquisti_Abbonamenti aa ON c.AccountID = aa.ClienteAccountID
        WHERE aa.DataFineValidita >= CURDATE()
      `;

      const [clients] = await pool.execute(query);
      
      return res.status(200).json({
        success: true,
        message: 'Clienti con abbonamento attivo recuperati con successo',
        count: clients.length,
        data: clients
      });
    } catch (error) {
      console.error('Errore durante il recupero dei clienti con abbonamento:', error);
      return res.status(500).json({
        success: false,
        message: 'Errore durante il recupero dei clienti con abbonamento',
        error: error.message
      });
    }
  },

  // Op 3.d: Visualizzazione dei clienti più fedeli
  getLoyalClients: async (req, res) => {
    try {
      const query = `
        SELECT 
          c.AccountID,
          c.Nome,
          c.Cognome,
          a.DataRegistrazione
        FROM Cliente c
        JOIN Account a ON c.AccountID = a.ID
        ORDER BY a.DataRegistrazione ASC
        LIMIT 10
      `;

      const [clients] = await pool.execute(query);
      
      return res.status(200).json({
        success: true,
        message: 'Clienti più fedeli recuperati con successo',
        count: clients.length,
        data: clients
      });
    } catch (error) {
      console.error('Errore durante il recupero dei clienti più fedeli:', error);
      return res.status(500).json({
        success: false,
        message: 'Errore durante il recupero dei clienti più fedeli',
        error: error.message
      });
    }
  }
};

module.exports = clientiController;