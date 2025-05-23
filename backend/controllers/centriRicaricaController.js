const { pool } = require('../config/database');

const centriRicaricaController = {
  // Operazione 6.a - Inserimento: aggiunta di un nuovo centro di ricarica
  insertCentroRicarica: async (req, res) => {
    try {
      const {
        Indirizzo,
        NumeroStazioniDisponibili
      } = req.body;

      const query = `
        INSERT INTO CentroRicarica (Indirizzo, NumeroStazioniDisponibili)
        VALUES (?, ?)
      `;

      const values = [Indirizzo, NumeroStazioniDisponibili];

      await pool.execute(query, values);

      return res.status(201).json({
        success: true,
        message: 'Centro di ricarica aggiunto con successo',
        data: {
          Indirizzo,
          NumeroStazioniDisponibili
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

  // Operazione 6.c - Ricerca1: visualizzazione centro per zona geografica
  getCentriByZona: async (req, res) => {
    try {
      const { zona } = req.params;

      const query = `
        SELECT 
          c.Indirizzo, c.NumeroStazioniDisponibili,
          COUNT(s.ID) as StazioniAttive
        FROM CentroRicarica c
        LEFT JOIN StazioneRicarica s ON c.Indirizzo = s.CentroRicaricaIndirizzo
        AND s.StatoCorrente != 'eliminata'
        WHERE c.Indirizzo LIKE ?
        GROUP BY c.Indirizzo, c.NumeroStazioniDisponibili 
        ORDER BY c.Indirizzo
      `;

      const [centri] = await pool.execute(query, [`%${zona}%`]);
      
      return res.status(200).json({
        success: true,
        message: 'Centri di ricarica per zona recuperati con successo',
        count: centri.length,
        data: centri
      });
    } catch (error) {
      console.error('Errore durante il recupero dei centri per zona:', error);
      return res.status(500).json({
        success: false,
        message: 'Errore durante il recupero dei centri per zona',
        error: error.message
      });
    }
  },

  // Operazione 6.d - Ricerca2: visualizzazione centro per servizi accessori
  getCentriByServizi: async (req, res) => {
    try {
      const { servizio } = req.params;

      // Assumendo che i servizi accessori siano memorizzati in una tabella separata
      // o come parte dell'indirizzo/descrizione del centro
      const query = `
        SELECT 
          c.Indirizzo, c.NumeroStazioniDisponibili,
          COUNT(s.ID) as StazioniAttive
        FROM CentroRicarica c
        LEFT JOIN StazioneRicarica s ON c.Indirizzo = s.CentroRicaricaIndirizzo
        AND s.StatoCorrente != 'eliminata'
        WHERE c.Indirizzo LIKE ? OR c.NumeroStazioniDisponibili > 0
        GROUP BY c.Indirizzo, c.NumeroStazioniDisponibili 
        ORDER BY c.NumeroStazioniDisponibili DESC
      `;

      const [centri] = await pool.execute(query, [`%${servizio}%`]);
      
      return res.status(200).json({
        success: true,
        message: 'Centri di ricarica con servizi accessori recuperati con successo',
        count: centri.length,
        data: centri
      });
    } catch (error) {
      console.error('Errore durante il recupero dei centri per servizi:', error);
      return res.status(500).json({
        success: false,
        message: 'Errore durante il recupero dei centri per servizi',
        error: error.message
      });
    }
  }
};

module.exports = centriRicaricaController; 