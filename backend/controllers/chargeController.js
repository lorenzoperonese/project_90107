const { pool } = require('../config/database');

const ricaricheController = {
  // Operazione 5.a - Inserimento: registrazione inizio di una nuova sessione di ricarica
  startRicarica: async (req, res) => {
    try {
      const {
        OperatoreAccountID,
        VeicoloID,
        StazioneRicaricaID,
        DataInizio
      } = req.body;

      // Use provided DataInizio or current time if not provided
      const dataInizioToUse = DataInizio || new Date();

      const query = `
        INSERT INTO Ricarica (
          OperatoreAccountID, VeicoloID, StazioneRicaricaID, DataInizio
        ) VALUES (?, ?, ?, ?)
      `;

      const values = [
        OperatoreAccountID,
        VeicoloID,
        StazioneRicaricaID,
        dataInizioToUse
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
          DataInizio: dataInizioToUse
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
        KWhCaricati,
        DataFine
      } = req.body;

      // Get the current charging session to check DataInizio
      const checkQuery = `SELECT DataInizio FROM Ricarica WHERE ID = ?`;
      const [chargingResult] = await pool.execute(checkQuery, [id]);
      
      if (chargingResult.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Sessione di ricarica non trovata'
        });
      }

      const dataInizio = new Date(chargingResult[0].DataInizio);
      const dataFineToUse = DataFine ? new Date(DataFine) : new Date();

      // Validate that DataFine is after DataInizio
      if (dataFineToUse <= dataInizio) {
        return res.status(400).json({
          success: false,
          message: 'Errore durante la conclusione della sessione di ricarica',
          error: 'La data di fine deve essere successiva a quella di inizio'
        });
      }

      const query = `
        UPDATE Ricarica 
        SET DataFine = ?, CostoSessione = ?, KWhCaricati = ?
        WHERE ID = ?
      `;

      const values = [dataFineToUse, CostoSessione, KWhCaricati, id];

      const [result] = await pool.execute(query, values);

      return res.status(200).json({
        success: true,
        message: 'Sessione di ricarica conclusa con successo',
        data: { 
          id,
          CostoSessione,
          KWhCaricati,
          DataInizio: dataInizio,
          DataFine: dataFineToUse
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

  // Veicoli che hanno effettuato più ricariche nell'ultimo mese
  getVeicoliPiuRicaricati: async (req, res) => {
    try {
      const query = `
        SELECT 
            v.ID,
            v.Targa,
            v.Modello,
            v.Marca,
            COUNT(r.ID) AS NumeroRicariche
        FROM Veicolo v
        JOIN Ricarica r ON v.ID = r.VeicoloID
        WHERE r.DataInizio >= DATE_SUB(CURDATE(), INTERVAL 1 MONTH)
        GROUP BY v.ID, v.Targa, v.Modello, v.Marca
        ORDER BY NumeroRicariche DESC
        LIMIT 10
      `;
      
      const [veicoli] = await pool.execute(query);
      
      return res.status(200).json({
        success: true,
        message: 'Veicoli più ricaricati nell\'ultimo mese recuperati con successo',
        count: veicoli.length,
        data: veicoli
      });
    } catch (error) {
      console.error('Errore durante il recupero dei veicoli più ricaricati:', error);
      return res.status(500).json({
        success: false,
        message: 'Errore durante il recupero dei veicoli più ricaricati',
        error: error.message
      });
    }
  },

  // Operatori che hanno effettuato più ricariche
  getOperatoriPiuAttivi: async (req, res) => {
    try {
      const query = `
        SELECT 
            o.AccountID,
            a.Email,
            COUNT(r.ID) AS NumeroRicariche
        FROM OperatoreRicarica o
        JOIN Account a ON o.AccountID = a.ID
        JOIN Ricarica r ON o.AccountID = r.OperatoreAccountID
        GROUP BY o.AccountID, a.Email
        ORDER BY NumeroRicariche DESC
        LIMIT 5
      `;
      
      const [operatori] = await pool.execute(query);
      
      return res.status(200).json({
        success: true,
        message: 'Operatori più attivi recuperati con successo',
        count: operatori.length,
        data: operatori
      });
    } catch (error) {
      console.error('Errore durante il recupero degli operatori più attivi:', error);
      return res.status(500).json({
        success: false,
        message: 'Errore durante il recupero degli operatori più attivi',
        error: error.message
      });
    }
  }
};

module.exports = ricaricheController;