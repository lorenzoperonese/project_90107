const { pool } = require('../config/database');

const manutenzioniController = {
  // Operazione: inserimento di un intervento (manutenzione o revisione)
  insertIntervento: async (req, res) => {
    try {
      const {
        VeicoloID,
        OfficinaID,
        TipoIntervento, // 'manutenzione' o 'revisione'
        DataIntervento,
        Costo,
        Descrizione,
        Note
      } = req.body;

      console.log('Dati ricevuti per l\'inserimento:', req.body);

      // Validazione dei campi obbligatori
      if (!VeicoloID) {
        return res.status(400).json({
          success: false,
          message: 'ID Veicolo è obbligatorio'
        });
      }

      if (!OfficinaID) {
        return res.status(400).json({
          success: false,
          message: 'ID Officina è obbligatorio'
        });
      }

      // Validazione del tipo di intervento
      if (!['manutenzione', 'revisione'].includes(TipoIntervento)) {
        return res.status(400).json({
          success: false,
          message: 'Tipo intervento deve essere "manutenzione" o "revisione"'
        });
      }

      let query, values;

      if (TipoIntervento === 'revisione') {
        // Inserimento nella tabella EsegueRevisione
        query = `
          INSERT INTO EsegueRevisione (
            VeicoloID, OfficinaID, Data, Costo, Note
          ) VALUES (?, ?, ?, ?, ?)
        `;
        values = [
          VeicoloID,
          OfficinaID,
          DataIntervento || new Date(),
          Costo || 0,
          Note || Descrizione
        ];
      } else {
        // Inserimento nella tabella EsegueIntervento
        query = `
          INSERT INTO EsegueIntervento (
            VeicoloID, OfficinaID, Data, Costo, Tipologia, Descrizione
          ) VALUES (?, ?, ?, ?, ?, ?)
        `;
        values = [
          VeicoloID,
          OfficinaID,
          DataIntervento || new Date(),
          Costo || 0,
          'Manutenzione',
          Descrizione
        ];
      }

      const [result] = await pool.execute(query, values);

      return res.status(201).json({
        success: true,
        message: `${TipoIntervento.charAt(0).toUpperCase() + TipoIntervento.slice(1)} registrata con successo`,
        data: {
          id: result.insertId,
          VeicoloID,
          OfficinaID,
          TipoIntervento,
          Data: DataIntervento || new Date()
        }
      });
    } catch (error) {
      console.error('Errore durante la registrazione dell\'intervento:', error);
      return res.status(500).json({
        success: false,
        message: 'Errore durante la registrazione dell\'intervento',
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
  },

  // Operazione: visualizzazione degli ultimi 5 clienti che hanno noleggiato veicoli con interventi
  getLastClientsWithInterventions: async (req, res) => {
    try {
      const { veicoloId } = req.params;
      console.log('ID Veicolo ricevuto:', veicoloId);

      const query = `
        SELECT DISTINCT
          c.AccountID,
          c.Nome,
          c.Cognome,
          acc.Email,
          n.DataInizio as UltimoNoleggio,
          n.DataFine,
          v.Targa,
          v.Modello,
          v.Marca,
          'Intervento' as TipoManutenzione,
          ei.Data as DataIntervento,
          ei.Tipologia as DescrizioneIntervento,
          o.Nome as OfficinaNome
        FROM Cliente c
        INNER JOIN Account acc ON c.AccountID = acc.ID
        INNER JOIN Noleggia n ON c.AccountID = n.ClienteAccountID
        INNER JOIN Veicolo v ON n.VeicoloID = v.ID
        INNER JOIN EsegueIntervento ei ON v.ID = ei.VeicoloID
        INNER JOIN Officina o ON ei.OfficinaID = o.ID
        WHERE v.ID = ?
        
        UNION
        
        SELECT DISTINCT
          c.AccountID,
          c.Nome,
          c.Cognome,
          acc.Email,
          n.DataInizio as UltimoNoleggio,
          n.DataFine,
          v.Targa,
          v.Modello,
          v.Marca,
          'Revisione' as TipoManutenzione,
          er.Data as DataIntervento,
          'Revisione' as DescrizioneIntervento,
          o.Nome as OfficinaNome
        FROM Cliente c
        INNER JOIN Account acc ON c.AccountID = acc.ID
        INNER JOIN Noleggia n ON c.AccountID = n.ClienteAccountID
        INNER JOIN Veicolo v ON n.VeicoloID = v.ID
        INNER JOIN EsegueRevisione er ON v.ID = er.VeicoloID
        INNER JOIN Officina o ON er.OfficinaID = o.ID
        WHERE v.ID = ?
        
        ORDER BY UltimoNoleggio DESC
        LIMIT 5
      `;

      const [clienti] = await pool.execute(query, [veicoloId, veicoloId]);
      
      return res.status(200).json({
        success: true,
        message: `Ultimi 5 clienti che hanno noleggiato il veicolo ID ${veicoloId} con interventi recuperati con successo`,
        count: clienti.length,
        data: clienti
      });
    } catch (error) {
      console.error('Errore durante il recupero dei clienti con interventi:', error);
      return res.status(500).json({
        success: false,
        message: 'Errore durante il recupero dei clienti con interventi',
        error: error.message
      });
    }
  },

  // Operazione: visualizzazione veicoli che hanno effettuato manutenzioni/revisioni presso una specifica officina
  getVehiclesByWorkshop: async (req, res) => {
    try {
      const { officinaId } = req.params;
      console.log('ID Officina ricevuto:', officinaId);

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
          o.Nome as OfficinaNome,
          o.Indirizzo as OfficinaIndirizzo,
          'Intervento' as TipoManutenzione,
          ei.Data as DataUltimoIntervento,
          ei.Tipologia as DescrizioneIntervento,
          ei.Costo as CostoUltimoIntervento,
          COUNT(ei.ID) as NumeroInterventi
        FROM Veicolo v
        INNER JOIN EsegueIntervento ei ON v.ID = ei.VeicoloID
        INNER JOIN Officina o ON ei.OfficinaID = o.ID
        WHERE o.ID = ?
        GROUP BY v.ID, v.Targa, v.Tipologia, v.Modello, v.Marca, v.PercentualeBatteria, v.Stato, v.ChilometraggioTotale, o.Nome, o.Indirizzo, ei.Data, ei.Tipologia, ei.Costo
        
        UNION
        
        SELECT DISTINCT
          v.ID,
          v.Targa,
          v.Tipologia,
          v.Modello,
          v.Marca,
          v.PercentualeBatteria,
          v.Stato,
          v.ChilometraggioTotale,
          o.Nome as OfficinaNome,
          o.Indirizzo as OfficinaIndirizzo,
          'Revisione' as TipoManutenzione,
          er.Data as DataUltimoIntervento,
          'Revisione' as DescrizioneIntervento,
          er.Costo as CostoUltimoIntervento,
          COUNT(er.ID) as NumeroInterventi
        FROM Veicolo v
        INNER JOIN EsegueRevisione er ON v.ID = er.VeicoloID
        INNER JOIN Officina o ON er.OfficinaID = o.ID
        WHERE o.ID = ?
        GROUP BY v.ID, v.Targa, v.Tipologia, v.Modello, v.Marca, v.PercentualeBatteria, v.Stato, v.ChilometraggioTotale, o.Nome, o.Indirizzo, er.Data, er.Costo
        
        ORDER BY DataUltimoIntervento DESC
      `;

      const [veicoli] = await pool.execute(query, [officinaId, officinaId]);
      
      return res.status(200).json({
        success: true,
        message: `Veicoli che hanno effettuato manutenzioni/revisioni presso l'officina ID ${officinaId} recuperati con successo`,
        count: veicoli.length,
        data: veicoli
      });
    } catch (error) {
      console.error('Errore durante il recupero dei veicoli per officina:', error);
      return res.status(500).json({
        success: false,
        message: 'Errore durante il recupero dei veicoli per officina',
        error: error.message
      });
    }
  }
};

module.exports = manutenzioniController;