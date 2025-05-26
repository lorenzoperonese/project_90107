const { pool } = require('../config/database');
const { parseGpsString } = require('../utils/gpsUtils');

const stazioniRicaricaController = {
  // Operazione 7.a - Inserimento: aggiunta di una nuova stazione di ricarica
  insertStazioneRicarica: async (req, res) => {
    try {
      const {
        TipologiaPresa,
        GPS,
        Stato,
        CentroRicaricaID
      } = req.body;

      // Parsing GPS
      const gpsFormatted = parseGpsString(GPS);

      let query = `
        INSERT INTO StazioneRicarica (
          TipologiaPresa, GPS, Stato, CentroRicarica
        ) VALUES (?, ST_PointFromText(?), ?, ?)
      `;

      if (!CentroRicaricaID) {
        query = `
          INSERT INTO StazioneRicarica (
            TipologiaPresa, GPS, Stato
          ) VALUES (?, ST_PointFromText(?), ?)
        `;
      }

      const values = [
        TipologiaPresa,
        gpsFormatted,
        Stato || 'libera'
      ];
      if (CentroRicaricaID) {
        values.push(CentroRicaricaID);
      }

      const [result] = await pool.execute(query, values);

      return res.status(201).json({
        success: true,
        message: 'Stazione di ricarica aggiunta con successo',
        data: {
          id: result.insertId,
          TipologiaPresa,
          Stato: Stato || 'libera',
          CentroRicaricaID
        }
      });
    } catch (error) {
      console.error('Errore durante l\'aggiunta della stazione di ricarica:', error);
      return res.status(500).json({
        success: false,
        message: 'Errore durante l\'aggiunta della stazione di ricarica',
        error: error.message
      });
    }
  },

  // Operazione 7.b - Modifica: aggiornamento dello stato della colonnina
  updateStatoStazione: async (req, res) => {
    try {
      const { id } = req.params;
      const { Stato } = req.body;

      const query = `UPDATE StazioneRicarica_Attivo SET Stato = ? WHERE ID = ?`;
      const [result] = await pool.execute(query, [Stato, id]);

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: 'Stazione di ricarica non trovata'
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Stato della colonnina aggiornato con successo',
        data: { id, Stato }
      });
    } catch (error) {
      console.error('Errore durante l\'aggiornamento dello stato della stazione:', error);
      return res.status(500).json({
        success: false,
        message: 'Errore durante l\'aggiornamento dello stato della stazione',
        error: error.message
      });
    }
  },

  // Op 7.c - Visualizzazione delle stazioni ordinate per energia totale erogata
  getEnergiaTotale: async (req, res) => {
    try {
      const { id } = req.params;

      const query = `
        SELECT 
          sr.ID,
          sr.TipologiaPresa,
          SUM(r.KWhCaricati) AS EnergiaTotaleKWh
        FROM StazioneRicarica sr
        JOIN Ricarica r ON sr.ID = r.StazioneRicaricaID
        WHERE sr.ID = ?
        GROUP BY sr.ID, sr.TipologiaPresa
      `;
      
      const [result] = await pool.execute(query, [id]);
      
      if (result.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Stazione di ricarica non trovata o nessuna ricarica effettuata'
        });
      }
      
      return res.status(200).json({
        success: true,
        message: 'Energia totale erogata recuperata con successo',
        data: result[0]
      });
    } catch (error) {
      console.error('Errore durante il recupero dell\'energia totale erogata:', error);
      return res.status(500).json({
        success: false,
        message: 'Errore durante il recupero dell\'energia totale erogata',
        error: error.message
      });
    }
  },

  // Op 7.d - Visualizzazione della durata media delle sessioni di ricarica per stazione
  getDurataMediaSessioni: async (req, res) => {
    try {
      const { id } = req.params;

      const query = `
        SELECT 
          sr.ID,
          sr.TipologiaPresa,
          AVG(TIMESTAMPDIFF(MINUTE, r.DataInizio, r.DataFine)) AS DurataMediaMinuti
        FROM StazioneRicarica sr
        JOIN Ricarica r ON sr.ID = r.StazioneRicaricaID
        WHERE sr.ID = ? AND r.DataFine IS NOT NULL
        GROUP BY sr.ID, sr.TipologiaPresa
      `;
      
      const [result] = await pool.execute(query, [id]);
      
      if (result.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Stazione di ricarica non trovata o nessuna ricarica completata'
        });
      }
      
      return res.status(200).json({
        success: true,
        message: 'Durata media delle sessioni recuperata con successo',
        data: result[0]
      });
    } catch (error) {
      console.error('Errore durante il recupero della durata media delle sessioni:', error);
      return res.status(500).json({
        success: false,
        message: 'Errore durante il recupero della durata media delle sessioni',
        error: error.message
      });
    }
  }
};

module.exports = stazioniRicaricaController;