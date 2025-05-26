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

  // Op 6.b: Visualizzazione energia totale ricaricata per centro di ricarica
  getEnergiaTotale: async (req, res) => {
    try {
      const { id } = req.params;

      const query = `
        SELECT 
          cr.ID,
          cr.Indirizzo,
          SUM(r.KWhCaricati) AS EnergiaTotale
        FROM CentroRicarica cr
        JOIN StazioneRicarica sr ON cr.ID = sr.CentroRicarica
        JOIN Ricarica r ON sr.ID = r.StazioneRicaricaID
        WHERE cr.ID = ?
        GROUP BY cr.ID, cr.Indirizzo
      `;
      
      const [result] = await pool.execute(query, [id]);
      
      if (result.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Centro di ricarica non trovato o nessuna ricarica effettuata'
        });
      }
      
      return res.status(200).json({
        success: true,
        message: 'Energia totale ricaricata recuperata con successo',
        data: result[0]
      });
    } catch (error) {
      console.error('Errore durante il recupero dell\'energia totale:', error);
      return res.status(500).json({
        success: false,
        message: 'Errore durante il recupero dell\'energia totale',
        error: error.message
      });
    }
  },

  // Op 6.c: Visualizzazione dei 5 centri di ricarica con più ricariche effettuate nell'ultimo anno
  getCentriPiuAttivi: async (req, res) => {
    try {
      const query = `
        SELECT 
          cr.ID,
          cr.Indirizzo,
          cr.NumeroStazioniDisponibili,
          COUNT(r.ID) AS NumeroRicariche
        FROM CentroRicarica cr
        JOIN StazioneRicarica sr ON cr.ID = sr.CentroRicarica
        JOIN Ricarica r ON sr.ID = r.StazioneRicaricaID
        WHERE r.DataInizio >= DATE_SUB(CURDATE(), INTERVAL 1 YEAR)
        GROUP BY cr.ID, cr.Indirizzo, cr.NumeroStazioniDisponibili
        ORDER BY NumeroRicariche DESC
        LIMIT 5
      `;
      
      const [centri] = await pool.execute(query);
      
      return res.status(200).json({
        success: true,
        message: 'Centri di ricarica più attivi recuperati con successo',
        count: centri.length,
        data: centri
      });
    } catch (error) {
      console.error('Errore durante il recupero dei centri più attivi:', error);
      return res.status(500).json({
        success: false,
        message: 'Errore durante il recupero dei centri più attivi',
        error: error.message
      });
    }
  }
};

module.exports = centriRicaricaController; 