const { pool } = require('../config/database');
const { parseGpsString } = require('../utils/gpsUtils');

const stazioniRicaricaController = {
  // Operazione 7.a - Inserimento: aggiunta di una nuova stazione di ricarica
  insertStazioneRicarica: async (req, res) => {
    try {
      const {
        TipologiaPresa,
        GPS,
        StatoCorrente,
        CentroRicaricaIndirizzo
      } = req.body;

      // Parsing GPS
      const gpsFormatted = parseGpsString(GPS);

      let query = `
        INSERT INTO StazioneRicarica (
          TipologiaPresa, GPS, StatoCorrente, CentroRicaricaIndirizzo
        ) VALUES (?, ST_PointFromText(?), ?, ?)
      `;

      if (!CentroRicaricaIndirizzo) {
        query = `
          INSERT INTO StazioneRicarica (
            TipologiaPresa, GPS, StatoCorrente
          ) VALUES (?, ST_PointFromText(?), ?)
        `;
      }

      const values = [
        TipologiaPresa,
        gpsFormatted,
        StatoCorrente || 'libera'
      ];
      if (CentroRicaricaIndirizzo) {
        values.push(CentroRicaricaIndirizzo);
      }

      const [result] = await pool.execute(query, values);

      return res.status(201).json({
        success: true,
        message: 'Stazione di ricarica aggiunta con successo',
        data: {
          id: result.insertId,
          TipologiaPresa,
          StatoCorrente: StatoCorrente || 'libera',
          CentroRicaricaIndirizzo
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
      const { StatoCorrente } = req.body;

      const query = `UPDATE StazioneRicarica SET StatoCorrente = ? WHERE ID = ?`;
      const [result] = await pool.execute(query, [StatoCorrente, id]);

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: 'Stazione di ricarica non trovata'
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Stato della colonnina aggiornato con successo',
        data: { id, StatoCorrente }
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

  // Operazione 7.c - Cancellazione: rimozione di una stazione
  deleteStazioneRicarica: async (req, res) => {
    try {
      const { id } = req.params;

      const query = 'UPDATE StazioneRicarica SET StatoCorrente = "eliminata" WHERE ID = ?';
      const [result] = await pool.execute(query, [id]);

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: 'Stazione di ricarica non trovata'
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Stazione di ricarica rimossa con successo',
        data: { id }
      });
    } catch (error) {
      console.error('Errore durante la rimozione della stazione di ricarica:', error);
      return res.status(500).json({
        success: false,
        message: 'Errore durante la rimozione della stazione di ricarica',
        error: error.message
      });
    }
  },

  // Operazione 7.d - Ricerca: visualizzazione colonnine per zona geografica
  getStazioniByZona: async (req, res) => {
    try {
      const { zona } = req.params;

      const query = `
        SELECT 
          s.ID, s.TipologiaPresa, s.StatoCorrente, s.CentroRicaricaIndirizzo,
          ST_X(s.GPS) as Latitudine, ST_Y(s.GPS) as Longitudine,
          c.NumeroStazioniDisponibili as CentroStazioni
        FROM StazioneRicarica s
        LEFT JOIN CentroRicarica c ON s.CentroRicaricaIndirizzo = c.Indirizzo
        WHERE s.CentroRicaricaIndirizzo LIKE ?
        ORDER BY s.ID
      `;

      const [stazioni] = await pool.execute(query, [`%${zona}%`]);
      
      return res.status(200).json({
        success: true,
        message: 'Colonnine di ricarica per zona recuperate con successo',
        count: stazioni.length,
        data: stazioni
      });
    } catch (error) {
      console.error('Errore durante il recupero delle colonnine per zona:', error);
      return res.status(500).json({
        success: false,
        message: 'Errore durante il recupero delle colonnine per zona',
        error: error.message
      });
    }
  }
};

module.exports = stazioniRicaricaController;