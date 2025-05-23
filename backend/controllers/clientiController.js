const { pool } = require('../config/database');
const bcrypt = require('bcrypt');

const clientiController = {
  // GET /api/clienti - Visualizza clienti con filtri opzionali
  getClienti: async (req, res) => {
    try {
      let query = `
        SELECT 
          c.AccountID, c.Nome, c.Cognome, c.DataNascita, c.LuogoNascita,
          c.IndirizzoResidenza, c.PatenteNumero, c.DocumentoNumero,
          a.Email, a.Telefono, a.Stato, a.DataRegistrazione
        FROM Cliente c
        JOIN Account a ON c.AccountID = a.ID
      `;
      const params = [];
      const conditions = [];

      // Filtri opzionali
      if (req.query.id) {
        conditions.push('c.AccountID = ?');
        params.push(req.query.id);
      }
      if (req.query.email) {
        conditions.push('a.Email LIKE ?');
        params.push(`%${req.query.email}%`);
      }
      if (req.query.nome) {
        conditions.push('c.Nome LIKE ?');
        params.push(`%${req.query.nome}%`);
      }
      if (req.query.cognome) {
        conditions.push('c.Cognome LIKE ?');
        params.push(`%${req.query.cognome}%`);
      }

      if (conditions.length > 0) {
        query += ' WHERE ' + conditions.join(' AND ');
      }

      const [clienti] = await pool.execute(query, params);
      
      return res.status(200).json({
        success: true,
        message: 'Clienti recuperati con successo',
        count: clienti.length,
        data: clienti
      });
    } catch (error) {
      console.error('Errore durante il recupero dei clienti:', error);
      return res.status(500).json({
        success: false,
        message: 'Errore durante il recupero dei clienti',
        error: error.message
      });
    }
  },

  // POST /api/clienti - Crea nuovo cliente
  createCliente: async (req, res) => {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const {
        Nome,
        Cognome,
        DataNascita,
        LuogoNascita,
        IndirizzoResidenza,
        PatenteNumero,
        DocumentoNumero,
        Email,
        Password,
        Telefono
      } = req.body;

      // Hash della password
      const hashedPassword = await bcrypt.hash(Password, 10);

      // Inserimento Account
      const accountQuery = `
        INSERT INTO Account (Email, Password, Telefono, Stato, Dipendente)
        VALUES (?, ?, ?, 'in_fase_di_verifica', FALSE)
      `;
      const [accountResult] = await connection.execute(accountQuery, [Email, hashedPassword, Telefono]);
      const accountId = accountResult.insertId;

      // Inserimento Cliente
      const clienteQuery = `
        INSERT INTO Cliente (
          AccountID, Nome, Cognome, DataNascita, LuogoNascita,
          IndirizzoResidenza, PatenteNumero, DocumentoNumero
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;
      await connection.execute(clienteQuery, [
        accountId, Nome, Cognome, DataNascita, LuogoNascita,
        IndirizzoResidenza, PatenteNumero, DocumentoNumero
      ]);

      await connection.commit();

      return res.status(201).json({
        success: true,
        message: 'Cliente creato con successo',
        data: {
          AccountID: accountId,
          Nome,
          Cognome,
          Email
        }
      });
    } catch (error) {
      await connection.rollback();
      console.error('Errore durante la creazione del cliente:', error);
      
      return res.status(500).json({
        success: false,
        message: 'Errore durante la creazione del cliente',
        error: error.message
      });
    } finally {
      connection.release();
    }
  },

  // PUT /api/clienti/:id - Aggiorna cliente esistente
  updateCliente: async (req, res) => {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      
      const { id } = req.params;
      const accountFields = [];
      const clienteFields = [];
      const accountValues = [];
      const clienteValues = [];

      // Campi Account aggiornabili
      const accountAllowedFields = ['Email', 'Telefono', 'Stato'];
      accountAllowedFields.forEach(field => {
        if (req.body[field] !== undefined) {
          accountFields.push(`${field} = ?`);
          accountValues.push(req.body[field]);
        }
      });

      // Campi Cliente aggiornabili
      const clienteAllowedFields = [
        'Nome', 'Cognome', 'DataNascita', 'LuogoNascita',
        'IndirizzoResidenza', 'PatenteNumero', 'DocumentoNumero'
      ];
      clienteAllowedFields.forEach(field => {
        if (req.body[field] !== undefined) {
          clienteFields.push(`${field} = ?`);
          clienteValues.push(req.body[field]);
        }
      });

      // Aggiorna Account se ci sono campi
      if (accountFields.length > 0) {
        accountValues.push(id);
        const accountQuery = `UPDATE Account SET ${accountFields.join(', ')} WHERE ID = ?`;
        await connection.execute(accountQuery, accountValues);
      }

      // Aggiorna Cliente se ci sono campi
      if (clienteFields.length > 0) {
        clienteValues.push(id);
        const clienteQuery = `UPDATE Cliente SET ${clienteFields.join(', ')} WHERE AccountID = ?`;
        await connection.execute(clienteQuery, clienteValues);
      }

      await connection.commit();

      return res.status(200).json({
        success: true,
        message: 'Cliente aggiornato con successo',
        data: { AccountID: id }
      });
    } catch (error) {
      await connection.rollback();
      console.error('Errore durante l\'aggiornamento del cliente:', error);
      return res.status(500).json({
        success: false,
        message: 'Errore durante l\'aggiornamento del cliente',
        error: error.message
      });
    } finally {
      connection.release();
    }
  },

  // DELETE /api/clienti/:id - Elimina cliente
  deleteCliente: async (req, res) => {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      
      const { id } = req.params;

      // Elimina Cliente (CASCADE eliminerà anche Account)
      const clienteQuery = 'DELETE FROM Cliente WHERE AccountID = ?';
      const [clienteResult] = await connection.execute(clienteQuery, [id]);

      if (clienteResult.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: 'Cliente non trovato'
        });
      }

      // Elimina Account
      const accountQuery = 'DELETE FROM Account WHERE ID = ?';
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
        PatenteNumero,
        DocumentoNumero,
        Email,
        Password,
        Telefono
      } = req.body;

      // Hash della password
      const hashedPassword = await bcrypt.hash(Password, 10);

      // Inserimento Account
      const accountQuery = `
        INSERT INTO Account (Email, Password, Telefono, Stato, Dipendente)
        VALUES (?, ?, ?, 'in_fase_di_verifica', FALSE)
      `;
      const [accountResult] = await connection.execute(accountQuery, [Email, hashedPassword, Telefono]);
      const accountId = accountResult.insertId;

      // Inserimento Cliente
      const clienteQuery = `
        INSERT INTO Cliente (
          AccountID, Nome, Cognome, DataNascita, LuogoNascita,
          IndirizzoResidenza, PatenteNumero, DocumentoNumero
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;
      await connection.execute(clienteQuery, [
        accountId, Nome, Cognome, DataNascita, LuogoNascita,
        IndirizzoResidenza, PatenteNumero, DocumentoNumero
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
      const { Email, Telefono } = req.body;

      const query = `UPDATE Account SET Email = ?, Telefono = ? WHERE ID = ?`;
      const [result] = await pool.execute(query, [Email, Telefono, id]);

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: 'Cliente non trovato'
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Dati di pagamento aggiornati con successo',
        data: { AccountID: id, Email, Telefono }
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
      const { PatenteNumero } = req.body;

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
        data: { AccountID: id, PatenteNumero }
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