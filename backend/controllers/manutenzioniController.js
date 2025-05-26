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
            cai.ID AS AccountID,
            cai.Nome,
            cai.Cognome,
            cai.Email,
            n.DataInizio AS UltimoNoleggio,
            n.DataFine,
            v.Targa,
            v.Modello,
            v.Marca,
            ei.Data AS DataIntervento,
            ei.Tipologia AS DescrizioneIntervento,
            o.Nome AS OfficinaNome
        FROM Cliente_Account_Info cai
        INNER JOIN Noleggia n ON cai.ID = n.ClienteAccountID
        INNER JOIN Veicolo v ON n.VeicoloID = v.ID
        INNER JOIN EsegueIntervento ei ON v.ID = ei.VeicoloID
        INNER JOIN Officina o ON ei.OfficinaID = o.ID
        WHERE ei.ID = ? AND n.DataFine < ei.Data
        ORDER BY UltimoNoleggio DESC
        LIMIT 5;
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

  // Operazione 4.b - Visualizzazione tipologie di intervento più costose in media
  getCostiMedi: async (req, res) => {
    try {
      const query = `
        SELECT 
            ei.Tipologia,
            AVG(ei.Costo) AS CostoMedio
        FROM EsegueIntervento ei
        GROUP BY ei.Tipologia
        ORDER BY CostoMedio DESC
        LIMIT 5
      `;
      
      const [result] = await pool.execute(query);
      
      return res.status(200).json({
        success: true,
        message: 'Costi medi per tipologia di intervento recuperati con successo',
        count: result.length,
        data: result
      });
    } catch (error) {
      console.error('Errore durante il recupero dei costi medi per tipologia:', error);
      return res.status(500).json({
        success: false,
        message: 'Errore durante il recupero dei costi medi per tipologia',
        error: error.message
      });
    }
  },

  // Operazione 4.c - Andamento mensile dei costi di manutenzione
  getAndamentoMensile: async (req, res) => {
    try {
      const query = `
        SELECT 
            YEAR(Data) AS Anno,
            MONTH(Data) AS Mese,
            SUM(Costo) AS CostoTotale
        FROM EsegueIntervento
        GROUP BY Anno, Mese
        ORDER BY Anno DESC, Mese DESC
      `;
      
      const [result] = await pool.execute(query);
      
      return res.status(200).json({
        success: true,
        message: 'Andamento mensile dei costi di manutenzione recuperato con successo',
        count: result.length,
        data: result
      });
    } catch (error) {
      console.error('Errore durante il recupero dell\'andamento mensile dei costi:', error);
      return res.status(500).json({
        success: false,
        message: 'Errore durante il recupero dell\'andamento mensile dei costi',
        error: error.message
      });
    }
  },

  // Visualizzazione dei noleggi effettuati prima di un intervento
  getNoleggiBeforeIntervento: async (req, res) => {
    try {
      const { interventoId } = req.params;
      
      // Verifica che l'ID sia valido
      if (!interventoId || isNaN(interventoId)) {
        return res.status(400).json({
          success: false,
          message: 'ID Intervento non valido'
        });
      }

      // Query per trovare i noleggi precedenti all'intervento
      const query = `
        SELECT DISTINCT
          n.ID as NoleggiID,
          n.DataInizio,
          n.DataFine,
          n.ChilometriPercorsi,
          n.DurataMinuti,
          c.AccountID as ClienteID,
          c.Nome as ClienteNome,
          c.Cognome as ClienteCognome,
          v.ID as VeicoloID,
          v.Targa,
          v.Modello,
          v.Marca,
          ei.Data as DataIntervento,
          ei.Tipologia as TipologiaIntervento
        FROM Noleggia n
        INNER JOIN Cliente c ON n.ClienteAccountID = c.AccountID
        INNER JOIN Veicolo v ON n.VeicoloID = v.ID
        INNER JOIN EsegueIntervento ei ON v.ID = ei.VeicoloID
        WHERE ei.ID = ?
          AND n.DataFine < ei.Data
        ORDER BY n.DataFine DESC
      `;
      
      const [noleggi] = await pool.execute(query, [interventoId]);
      
      return res.status(200).json({
        success: true,
        message: 'Noleggi prima dell\'intervento recuperati con successo',
        count: noleggi.length,
        data: noleggi
      });
    } catch (error) {
      console.error('Errore durante il recupero dei noleggi prima dell\'intervento:', error);
      return res.status(500).json({
        success: false,
        message: 'Errore durante il recupero dei noleggi prima dell\'intervento',
        error: error.message
      });
    }
  }
};

module.exports = manutenzioniController;