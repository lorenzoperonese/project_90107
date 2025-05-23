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
          ClienteAccountID, VeicoloID, DataInizio, GPSInizio, EsitoPagamento
        ) VALUES (?, ?, NOW(), ?, 'in_attesa')
      `;

      const values = [
        ClienteAccountID,
        VeicoloID,
        gpsInizioFormatted ? `ST_PointFromText('${gpsInizioFormatted}')` : null
      ];

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
            GPSFine = ${gpsFineFormatted ? 'ST_PointFromText(?)' : 'NULL'}, 
            ChilometriPercorsi = ?, 
            Costo = ?, 
            DurataMinuti = ?, 
            EsitoPagamento = ?
        WHERE ID = ?
      `;

      const values = gpsFineFormatted 
        ? [gpsFineFormatted, ChilometriPercorsi, Costo, DurataMinuti, EsitoPagamento, id]
        : [ChilometriPercorsi, Costo, DurataMinuti, EsitoPagamento, id];

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

  // Operazione 2.c - Ricerca: visualizzare lo storico dei noleggi per utente
  getNoleggiByUser: async (req, res) => {
    try {
      const { clienteId } = req.params;

      const query = `
        SELECT 
          n.ID, n.VeicoloID, n.DataInizio, n.DataFine,
          ST_X(n.GPSInizio) as LatitudineInizio, ST_Y(n.GPSInizio) as LongitudineInizio,
          ST_X(n.GPSFine) as LatitudineFine, ST_Y(n.GPSFine) as LongitudineFine,
          n.ChilometriPercorsi, n.Costo, n.DurataMinuti, n.EsitoPagamento,
          v.Targa as VeicoloTarga, v.Modello as VeicoloModello, v.Marca as VeicoloMarca
        FROM Noleggia n
        LEFT JOIN Veicolo v ON n.VeicoloID = v.ID
        WHERE n.ClienteAccountID = ?
        ORDER BY n.DataInizio DESC
      `;

      const [noleggi] = await pool.execute(query, [clienteId]);
      
      return res.status(200).json({
        success: true,
        message: 'Storico noleggi recuperato con successo',
        count: noleggi.length,
        data: noleggi
      });
    } catch (error) {
      console.error('Errore durante il recupero dello storico noleggi:', error);
      return res.status(500).json({
        success: false,
        message: 'Errore durante il recupero dello storico noleggi',
        error: error.message
      });
    }
  }
};

module.exports = noleggiController; 