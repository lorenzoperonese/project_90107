const { pool } = require('../config/database');

const manutenzioniController = {
  // Operazione 4.a - Inserimento: registrazione di un intervento tecnico per un veicolo
  insertManutenzione: async (req, res) => {
    try {
      const {
        VeicoloID,
        TipoIntervento,
        DataIntervento,
        Descrizione,
        Costo,
        OperatoreAccountID
      } = req.body;

      const query = `
        INSERT INTO Manutenzione (
          VeicoloID, TipoIntervento, DataIntervento, Descrizione, Costo, OperatoreAccountID
        ) VALUES (?, ?, ?, ?, ?, ?)
      `;

      const values = [
        VeicoloID,
        TipoIntervento,
        DataIntervento || new Date(),
        Descrizione,
        Costo,
        OperatoreAccountID
      ];

      const [result] = await pool.execute(query, values);

      return res.status(201).json({
        success: true,
        message: 'Intervento tecnico registrato con successo',
        data: {
          id: result.insertId,
          VeicoloID,
          TipoIntervento,
          DataIntervento: DataIntervento || new Date()
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

  // Operazione 4.b - Ricerca: visualizzazione storico manutenzioni per un veicolo
  getManutenzioniByVehicle: async (req, res) => {
    try {
      const { veicoloId } = req.params;

      const query = `
        SELECT 
          m.ID, m.TipoIntervento, m.DataIntervento, m.Descrizione, m.Costo,
          m.OperatoreAccountID,
          v.Targa as VeicoloTarga, v.Modello as VeicoloModello, v.Marca as VeicoloMarca,
          acc.Email as OperatoreEmail
        FROM Manutenzione m
        LEFT JOIN Veicolo v ON m.VeicoloID = v.ID
        LEFT JOIN Account acc ON m.OperatoreAccountID = acc.ID
        WHERE m.VeicoloID = ?
        ORDER BY m.DataIntervento DESC
      `;

      const [manutenzioni] = await pool.execute(query, [veicoloId]);
      
      return res.status(200).json({
        success: true,
        message: 'Storico manutenzioni recuperato con successo',
        count: manutenzioni.length,
        data: manutenzioni
      });
    } catch (error) {
      console.error('Errore durante il recupero dello storico manutenzioni:', error);
      return res.status(500).json({
        success: false,
        message: 'Errore durante il recupero dello storico manutenzioni',
        error: error.message
      });
    }
  }
};

module.exports = manutenzioniController; 