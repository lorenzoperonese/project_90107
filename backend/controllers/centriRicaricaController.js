const { pool } = require('../config/database');

const centriRicaricaController = {
  // Operazione 6.a - Inserimento: aggiunta di un nuovo centro di ricarica
  insertCentroRicarica: async (req, res) => {
    try {
      const {
        Indirizzo,
      } = req.body;

      const query = `
        INSERT INTO CentroRicarica (Indirizzo)
        VALUES (?)
      `;

      const values = [Indirizzo];

      await pool.execute(query, values);

      return res.status(201).json({
        success: true,
        message: 'Centro di ricarica aggiunto con successo',
        data: {
          Indirizzo,
        }
      });
    } catch (error) {
      console.error('Errore durante l\'aggiunta del centro di ricarica:', error);
      
      return res.status(500).json({
        success: false,
        message: 'Errore durante l\'aggiunta del centro di ricarica',
        error: error.message
      });
    }
  },

  // Operazione 6.b - Cancellazione: rimozione di un centro di ricarica
  deleteCentroRicarica: async (req, res) => {
    try {
      const { indirizzo } = req.params;
      const decodedIndirizzo = decodeURIComponent(indirizzo);

      const query = 'DELETE FROM CentroRicarica WHERE Indirizzo = ?';
      const [result] = await pool.execute(query, [decodedIndirizzo]);

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: 'Centro di ricarica non trovato'
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Centro di ricarica rimosso con successo',
        data: { Indirizzo: decodedIndirizzo }
      });
    } catch (error) {
      console.error('Errore durante la rimozione del centro di ricarica:', error);
      return res.status(500).json({
        success: false,
        message: 'Errore durante la rimozione del centro di ricarica',
        error: error.message
      });
    }
  },

  // Operazione 6.c - Ricerca1: visualizzazione dei centri ordinati in base al numero di stazioni disponibili
  getCentri: async (req, res) => {
    try {

      const query = `
        SELECT *
        FROM CentroRicarica
        ORDER BY NumeroStazioniDisponibili DESC
      `;

      const [centri] = await pool.execute(query);
      if (centri.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Nessun centro di ricarica trovato'
        });
      }
      return res.status(200).json({
        success: true,
        message: 'Centri di ricarica recuperati con successo',
        count: centri.length,
        data: centri
      });
    } catch (error) { 
      console.error('Errore durante il recupero dei centri di ricarica:', error);
      return res.status(500).json({
        success: false,
        message: 'Errore durante il recupero dei centri di ricarica',
        error: error.message
      });
    }
  },

  // Operazione 6.d - Ricerca2: visualizzazione veicoli caricati in un centro di ricarica
  getVehiclesByChargingCenter: async (req, res) => {
    try {
      const { indirizzo } = req.params;
      const decodedIndirizzo = decodeURIComponent(indirizzo);
      console.log('Indirizzo centro di ricarica ricevuto:', decodedIndirizzo);

      const query = `
        SELECT DISTINCT 
          v.ID,
          v.Targa,
          v.Tipologia,
          v.Modello,
          v.Marca,
          v.PercentualeBatteria,
          v.Stato,
          v.ChilometraggioTotale,
          COUNT(r.ID) as NumeroRicariche,
          MAX(r.DataInizio) as UltimaRicarica
        FROM Veicolo v
        INNER JOIN Ricarica r ON v.ID = r.VeicoloID
        INNER JOIN StazioneRicarica sr ON r.StazioneRicaricaID = sr.ID
        INNER JOIN CentroRicarica cr ON sr.CentroRicaricaIndirizzo = cr.Indirizzo
        WHERE cr.Indirizzo = ?
        GROUP BY v.ID, v.Targa, v.Tipologia, v.Modello, v.Marca, v.PercentualeBatteria, v.Stato, v.ChilometraggioTotale
        ORDER BY UltimaRicarica DESC, NumeroRicariche DESC
      `;

      const [vehicles] = await pool.execute(query, [decodedIndirizzo]);
      
      return res.status(200).json({
        success: true,
        message: `Veicoli caricati nel centro di ricarica "${decodedIndirizzo}" recuperati con successo`,
        count: vehicles.length,
        data: vehicles
      });
    } catch (error) {
      console.error('Errore durante il recupero dei veicoli caricati nel centro:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Errore durante il recupero dei veicoli caricati nel centro', 
        error: error.message 
      });
    }
  }
};

module.exports = centriRicaricaController; 