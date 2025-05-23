const { pool } = require('../config/database');

const ricaricheController = {
  // Operazione 5.a - Inserimento: registrazione inizio di una nuova sessione di ricarica
  startRicarica: async (req, res) => {
    try {
      const {
        OperatoreAccountID,
        VeicoloID,
        StazioneRicaricaID
      } = req.body;

      const query = `
        INSERT INTO Ricarica (
          OperatoreAccountID, VeicoloID, StazioneRicaricaID, DataInizio
        ) VALUES (?, ?, ?, NOW())
      `;

      const values = [
        OperatoreAccountID,
        VeicoloID,
        StazioneRicaricaID
      ];

      const [result] = await pool.execute(query, values);

      return res.status(201).json({
        success: true,
        message: 'Sessione di ricarica avviata con successo',
        data: {
          id: result.insertId,
          OperatoreAccountID,
          VeicoloID,
          StazioneRicaricaID,
          DataInizio: new Date()
        }
      });
    } catch (error) {
      console.error('Errore durante l\'avvio della sessione di ricarica:', error);
      return res.status(500).json({
        success: false,
        message: 'Errore durante l\'avvio della sessione di ricarica',
        error: error.message
      });
    }
  },

  // Operazione 5.b - Modifica: aggiornamento dati al termine della sessione
  endRicarica: async (req, res) => {
    try {
      const { id } = req.params;
      const {
        CostoSessione,
        KWhCaricati
      } = req.body;

      const query = `
        UPDATE Ricarica 
        SET DataFine = NOW(), CostoSessione = ?, KWhCaricati = ?
        WHERE ID = ?
      `;

      const values = [CostoSessione, KWhCaricati, id];

      const [result] = await pool.execute(query, values);

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: 'Sessione di ricarica non trovata'
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Sessione di ricarica conclusa con successo',
        data: { 
          id,
          CostoSessione,
          KWhCaricati,
          DataFine: new Date()
        }
      });
    } catch (error) {
      console.error('Errore durante la conclusione della sessione di ricarica:', error);
      return res.status(500).json({
        success: false,
        message: 'Errore durante la conclusione della sessione di ricarica',
        error: error.message
      });
    }
  },

  // Operazione 5.c - Ricerca1: visualizzazione storico delle ricariche per veicolo
  getRicaricheByVehicle: async (req, res) => {
    try {
      const { veicoloId } = req.params;

      const query = `
        SELECT 
          r.ID, r.OperatoreAccountID, r.StazioneRicaricaID,
          r.DataInizio, r.DataFine, r.CostoSessione, r.KWhCaricati,
          v.Targa as VeicoloTarga, v.Modello as VeicoloModello,
          s.TipologiaPresa as StazioneTipologia,
          ST_X(s.GPS) as StazioneLatitudine, ST_Y(s.GPS) as StazioneLongitudine,
          acc.Email as OperatoreEmail
        FROM Ricarica r
        LEFT JOIN Veicolo v ON r.VeicoloID = v.ID
        LEFT JOIN StazioneRicarica s ON r.StazioneRicaricaID = s.ID
        LEFT JOIN OperatoreRicarica op ON r.OperatoreAccountID = op.AccountID
        LEFT JOIN Account acc ON op.AccountID = acc.ID
        WHERE r.VeicoloID = ?
        ORDER BY r.DataInizio DESC
      `;

      const [ricariche] = await pool.execute(query, [veicoloId]);
      
      return res.status(200).json({
        success: true,
        message: 'Storico ricariche per veicolo recuperato con successo',
        count: ricariche.length,
        data: ricariche
      });
    } catch (error) {
      console.error('Errore durante il recupero dello storico ricariche per veicolo:', error);
      return res.status(500).json({
        success: false,
        message: 'Errore durante il recupero dello storico ricariche per veicolo',
        error: error.message
      });
    }
  },

  // Operazione 5.d - Ricerca2: visualizzazione storico ricariche effettuate da un addetto
  getRicaricheByOperatore: async (req, res) => {
    try {
      const { operatoreId } = req.params;

      const query = `
        SELECT 
          r.ID, r.VeicoloID, r.StazioneRicaricaID,
          r.DataInizio, r.DataFine, r.CostoSessione, r.KWhCaricati,
          v.Targa as VeicoloTarga, v.Modello as VeicoloModello,
          s.TipologiaPresa as StazioneTipologia,
          ST_X(s.GPS) as StazioneLatitudine, ST_Y(s.GPS) as StazioneLongitudine,
          acc.Email as OperatoreEmail
        FROM Ricarica r
        LEFT JOIN Veicolo v ON r.VeicoloID = v.ID
        LEFT JOIN StazioneRicarica s ON r.StazioneRicaricaID = s.ID
        LEFT JOIN OperatoreRicarica op ON r.OperatoreAccountID = op.AccountID
        LEFT JOIN Account acc ON op.AccountID = acc.ID
        WHERE r.OperatoreAccountID = ?
        ORDER BY r.DataInizio DESC
      `;

      const [ricariche] = await pool.execute(query, [operatoreId]);
      
      return res.status(200).json({
        success: true,
        message: 'Storico ricariche per operatore recuperato con successo',
        count: ricariche.length,
        data: ricariche
      });
    } catch (error) {
      console.error('Errore durante il recupero dello storico ricariche per operatore:', error);
      return res.status(500).json({
        success: false,
        message: 'Errore durante il recupero dello storico ricariche per operatore',
        error: error.message
      });
    }
  }
};

module.exports = ricaricheController;