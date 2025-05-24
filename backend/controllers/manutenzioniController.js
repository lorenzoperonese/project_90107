const { pool } = require('../config/database');

const manutenzioniController = {
  // Operazione: inserimento di un intervento tecnico
  insertIntervento: async (req, res) => {
    try {
      const {
        VeicoloID,
        OfficinaID,
        Data,
        Costo,
        Tipologia,
        Descrizione
      } = req.body;

      const query = `
        INSERT INTO EsegueIntervento (
          VeicoloID, OfficinaID, Data, Costo, Tipologia, Descrizione
        ) VALUES (?, ?, ?, ?, ?, ?)
      `;

      const values = [
        VeicoloID,
        OfficinaID,
        Data || new Date(),
        Costo,
        Tipologia,
        Descrizione
      ];

      const [result] = await pool.execute(query, values);

      return res.status(201).json({
        success: true,
        message: 'Intervento tecnico registrato con successo',
        data: {
          id: result.insertId,
          VeicoloID,
          OfficinaID,
          Tipologia,
          Data: Data || new Date()
        }
      });
    } catch (error) {
      console.error('Errore durante la registrazione dell\'intervento tecnico:', error);
      return res.status(500).json({
        success: false,
        message: 'Errore durante la registrazione dell\'intervento tecnico',
        error: error.message
      });
    }
  },

  // Operazione: inserimento di una revisione
  insertRevisione: async (req, res) => {
    try {
      const {
        VeicoloID,
        OfficinaID,
        Data,
        Costo,
        Note
      } = req.body;

      const query = `
        INSERT INTO EsegueRevisione (
          VeicoloID, OfficinaID, Data, Costo, Note
        ) VALUES (?, ?, ?, ?, ?)
      `;

      const values = [
        VeicoloID,
        OfficinaID,
        Data || new Date(),
        Costo,
        Note
      ];

      const [result] = await pool.execute(query, values);

      return res.status(201).json({
        success: true,
        message: 'Revisione registrata con successo',
        data: {
          id: result.insertId,
          VeicoloID,
          OfficinaID,
          Data: Data || new Date()
        }
      });
    } catch (error) {
      console.error('Errore durante la registrazione della revisione:', error);
      return res.status(500).json({
        success: false,
        message: 'Errore durante la registrazione della revisione',
        error: error.message
      });
    }
  },

  // Operazione: visualizzazione storico interventi per un veicolo
  getInterventiByVehicle: async (req, res) => {
    try {
      const { veicoloId } = req.params;

      const query = `
        SELECT 
          i.ID, i.Data, i.Costo, i.Tipologia, i.Descrizione,
          v.Targa as VeicoloTarga, v.Modello as VeicoloModello, v.Marca as VeicoloMarca,
          o.Nome as OfficinaNome, o.Indirizzo as OfficinaIndirizzo
        FROM EsegueIntervento i
        LEFT JOIN Veicolo v ON i.VeicoloID = v.ID
        LEFT JOIN Officina o ON i.OfficinaID = o.ID
        WHERE i.VeicoloID = ?
        ORDER BY i.Data DESC
      `;

      const [interventi] = await pool.execute(query, [veicoloId]);
      
      return res.status(200).json({
        success: true,
        message: 'Storico interventi recuperato con successo',
        count: interventi.length,
        data: interventi
      });
    } catch (error) {
      console.error('Errore durante il recupero dello storico interventi:', error);
      return res.status(500).json({
        success: false,
        message: 'Errore durante il recupero dello storico interventi',
        error: error.message
      });
    }
  },

  // Operazione: visualizzazione storico revisioni per un veicolo
  getRevisioniByVehicle: async (req, res) => {
    try {
      const { veicoloId } = req.params;

      const query = `
        SELECT 
          r.ID, r.Data, r.Costo, r.Note,
          v.Targa as VeicoloTarga, v.Modello as VeicoloModello, v.Marca as VeicoloMarca,
          o.Nome as OfficinaNome, o.Indirizzo as OfficinaIndirizzo
        FROM EsegueRevisione r
        LEFT JOIN Veicolo v ON r.VeicoloID = v.ID
        LEFT JOIN Officina o ON r.OfficinaID = o.ID
        WHERE r.VeicoloID = ?
        ORDER BY r.Data DESC
      `;

      const [revisioni] = await pool.execute(query, [veicoloId]);
      
      return res.status(200).json({
        success: true,
        message: 'Storico revisioni recuperato con successo',
        count: revisioni.length,
        data: revisioni
      });
    } catch (error) {
      console.error('Errore durante il recupero dello storico revisioni:', error);
      return res.status(500).json({
        success: false,
        message: 'Errore durante il recupero dello storico revisioni',
        error: error.message
      });
    }
  }
};

module.exports = manutenzioniController;