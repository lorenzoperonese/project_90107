const { pool } = require('../config/database');
const { parseGpsString } = require('../utils/gpsUtils');

const noleggiController = {
  // Operazione 2.a - Inserimento: avvio di un nuovo noleggio da parte di un cliente
  startNoleggio: async (req, res) => {
    try {
      const {
        ClienteAccountID,
        VeicoloID,
        GPSInizio
      } = req.body;

      // Parsing GPS inizio
      let gpsInizioFormatted = null;
      if (GPSInizio) {
        gpsInizioFormatted = parseGpsString(GPSInizio);
      }

      const query = `
        INSERT INTO Noleggia (
          ClienteAccountID, VeicoloID, GPSInizio
        ) VALUES (?, ?, ST_PointFromText(?))
      `;

      const values = [
        ClienteAccountID,
        VeicoloID,
        gpsInizioFormatted
      ];

      console.log(values)
      const [result] = await pool.execute(query, values);

      return res.status(201).json({
        success: true,
        message: 'Noleggio avviato con successo',
        data: {
          id: result.insertId,
          ClienteAccountID,
          VeicoloID,
          DataInizio: new Date()
        }
      });
    } catch (error) {
      console.error('Errore durante l\'avvio del noleggio:', error);
      return res.status(500).json({
        success: false,
        message: 'Errore durante l\'avvio del noleggio',
        error: error.message
      });
    }
  },

  // Operazione 2.b - Modifica: aggiornamento dati alla conclusione del noleggio
  endNoleggio: async (req, res) => {
    try {
      const { id } = req.params;
      const {
        GPSFine,
        ChilometriPercorsi,
        Costo,
        DurataMinuti,
        EsitoPagamento
      } = req.body;

      // Parsing GPS fine
      let gpsFineFormatted = null;
      if (GPSFine) {
        gpsFineFormatted = parseGpsString(GPSFine);
      }

      const query = `
        UPDATE Noleggia 
        SET DataFine = NOW(), 
            GPSFine = ST_PointFromText(?),
            ChilometriPercorsi = ?, 
            EsitoPagamento = ?
        WHERE ID = ?
      `;

      const values = [gpsFineFormatted, ChilometriPercorsi, EsitoPagamento, id];
      console.log(values)

      const [result] = await pool.execute(query, values);

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: 'Noleggio non trovato'
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Noleggio concluso con successo',
        data: { 
          id,
          ChilometriPercorsi,
          Costo,
          DurataMinuti,
          EsitoPagamento
        }
      });
    } catch (error) {
      console.error('Errore durante la conclusione del noleggio:', error);
      return res.status(500).json({
        success: false,
        message: 'Errore durante la conclusione del noleggio',
        error: error.message
      });
    }
  },

  // Operazione 2.d - Visualizzazione della durata media dei noleggi per ogni tipologia
  getDurataMediaPerTipologia: async (req, res) => {
    try {
      const query = `
        SELECT 
          v.Tipologia,
          AVG(n.DurataMinuti) AS DurataMediaMinuti
        FROM Noleggia n
        JOIN Veicolo v ON n.VeicoloID = v.ID
        WHERE n.DurataMinuti IS NOT NULL
        GROUP BY v.Tipologia
      `;

      const [result] = await pool.execute(query);
      
      return res.status(200).json({
        success: true,
        message: 'Durata media per tipologia recuperata con successo',
        data: result
      });
    } catch (error) {
      console.error('Errore durante il recupero della durata media:', error);
      return res.status(500).json({
        success: false,
        message: 'Errore durante il recupero della durata media',
        error: error.message
      });
    }
  },

  // Operazione 2.e - Visualizzazione dei veicoli con più chilometri percorsi
  getVeicoliConPiuKm: async (req, res) => {
    try {
      const query = `
        SELECT 
          v.ID,
          v.Modello,
          v.Marca,
          SUM(n.ChilometriPercorsi) AS KmTotaliNoleggi
        FROM Noleggia n
        JOIN Veicolo v ON n.VeicoloID = v.ID
        WHERE n.ChilometriPercorsi IS NOT NULL
        GROUP BY v.ID, v.Modello, v.Marca
        ORDER BY KmTotaliNoleggi DESC
        LIMIT 10
      `;

      const [result] = await pool.execute(query);
      
      return res.status(200).json({
        success: true,
        message: 'Veicoli con più chilometri recuperati con successo',
        data: result
      });
    } catch (error) {
      console.error('Errore durante il recupero dei veicoli con più km:', error);
      return res.status(500).json({
        success: false,
        message: 'Errore durante il recupero dei veicoli con più km',
        error: error.message
      });
    }
  },

  // Operazione 2.f - Visualizzazione andamento mensile dei noleggi
  getAndamentoMensile: async (req, res) => {
    try {
      const query = `
        SELECT 
          YEAR(DataInizio) AS Anno,
          MONTH(DataInizio) AS Mese,
          COUNT(*) AS NumeroNoleggi
        FROM Noleggia
        GROUP BY Anno, Mese
        ORDER BY Anno DESC, Mese DESC
      `;

      const [result] = await pool.execute(query);
      
      return res.status(200).json({
        success: true,
        message: 'Andamento mensile recuperato con successo',
        data: result
      });
    } catch (error) {
      console.error('Errore durante il recupero dell\'andamento mensile:', error);
      return res.status(500).json({
        success: false,
        message: 'Errore durante il recupero dell\'andamento mensile',
        error: error.message
      });
    }
  }
};

module.exports = noleggiController; 