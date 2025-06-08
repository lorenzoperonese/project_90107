const { pool } = require('../config/database');
const { parseGpsString } = require('../utils/gpsUtils');

const vehicleController = {
  // Operazione 1.a - Inserimento: aggiunta di un veicolo alla flotta
  insertVehicle: async (req, res) => {
    try {
      const { 
        Targa, 
        Tipologia, 
        ScadenzaRevisione,
        NumeroPolizzaAssicurativa,
        Modello,
        Marca,
        NumeroPosti,
        DataImmatricolazione,
        PercentualeBatteria,
        gpsQuery,
        Stato,
        ChilometraggioTotale,
      } = req.body;
      
  
      
      // Validazione dei campi obbligatori per tutti i veicoli
      if (!NumeroPolizzaAssicurativa) {
        return res.status(400).json({
          success: false,
          message: 'NumeroPolizzaAssicurativa è obbligatorio per tutti i veicoli'
        });
      }
      
      const gpsFormatted = parseGpsString(gpsQuery);
      
      // Campi base sempre presenti per tutti i tipi di veicoli
      const baseFields = ['Tipologia', 'Modello', 'Marca', 'PercentualeBatteria', 'GPS', 'Stato', 'NumeroPolizzaAssicurativa'];
      const baseValues = [Tipologia, Modello, Marca, PercentualeBatteria, gpsFormatted, Stato, NumeroPolizzaAssicurativa];
      
      // Campi condizionali
      const conditionalFields = [];
      const conditionalValues = [];
      
      // Aggiungi NumeroPosti e ChilometraggioTotale per tutti i tipi di veicoli
      if (NumeroPosti !== undefined && NumeroPosti !== null) {
        conditionalFields.push('NumeroPosti');
        conditionalValues.push(NumeroPosti);
      }
      
      if (ChilometraggioTotale !== undefined && ChilometraggioTotale !== null) {
        conditionalFields.push('ChilometraggioTotale');
        conditionalValues.push(ChilometraggioTotale);
      }
      
      // Campi specifici per auto e scooter
      if (['auto', 'scooter'].includes(Tipologia)) {
        if (Targa) {
          conditionalFields.push('Targa');
          conditionalValues.push(Targa);
        }
        if (ScadenzaRevisione) {
          conditionalFields.push('ScadenzaRevisione');
          conditionalValues.push(ScadenzaRevisione);
        }
        if (DataImmatricolazione) {
          conditionalFields.push('DataImmatricolazione');
          conditionalValues.push(DataImmatricolazione);
        }
      }
      
      // Costruisci la query dinamicamente
      const allFields = [...baseFields, ...conditionalFields];
      const allValues = [...baseValues, ...conditionalValues];
      
      const placeholders = allFields.map(field => field === 'GPS' ? 'ST_PointFromText(?)' : '?').join(', ');
      const fieldNames = allFields.join(', ');
      
      const query = `INSERT INTO Veicolo (${fieldNames}) VALUES (${placeholders})`;
      
      

      const [result] = await pool.execute(query, allValues);
      
      return res.status(201).json({
        success: true,
        message: 'Veicolo inserito con successo',
        data: {
          id: result.insertId,
          targa: Targa || null,
          tipologia: Tipologia,
          modello: Modello,
          marca: Marca
        }
      });
    } catch (error) {
      console.error('Errore durante l\'inserimento del veicolo:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Errore durante l\'inserimento del veicolo', 
        error: error.message 
      });
    }
  },

  // Operazione 1.b - Modifica: aggiornamento dei dati dello stato del veicolo
  updateVehicleState: async (req, res) => {
    try {
      const { id } = req.params;
      const {
        PercentualeBatteria,
        gpsQuery,
        Stato,
        ChilometraggioTotale,
      } = req.body;

            
      
      const gpsFormatted = parseGpsString(gpsQuery);
      
      const values = [
        PercentualeBatteria,
        gpsFormatted,
        Stato,
        ChilometraggioTotale,
        id
      ];

      
      const query = 'UPDATE Veicolo_Attivo SET PercentualeBatteria = ?, GPS = ST_PointFromText(?), Stato = ?, ChilometraggioTotale = ? WHERE ID = ?';

      const [result] = await pool.execute(query, values);
      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: 'Veicolo non trovato'
        });
      }
      return res.status(200).json({
        success: true,
        message: 'Stato veicolo aggiornato con successo',
        data: {
          id: id,
          percentualeBatteria: PercentualeBatteria,
          Stato: Stato,
          chilometraggioTotale: ChilometraggioTotale
        }
      });

    } catch (error) {
      console.error('Errore durante l\'aggiornamento dello stato del veicolo:', error);
      return res.status(500).json({
        success: false,
        message: 'Errore durante l\'aggiornamento dello stato del veicolo',
        error: error.message
      });
    }
  },

  // Operazione 1.c - Cancellazione: rimozione di un veicolo dalla flotta
  deleteVehicle: async (req, res) => {
    try {
      const { id } = req.params;
      
      
      const query = 'UPDATE Veicolo_Attivo SET Stato = "eliminato" WHERE ID = ?';
      const [result] = await pool.execute(query, [id]);
      
      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: 'Veicolo non trovato'
        });
      }
      
      return res.status(200).json({
        success: true,
        message: 'Veicolo rimosso dalla flotta con successo'
      });
    } catch (error) {
      console.error('Errore durante la rimozione del veicolo:', error);
      return res.status(500).json({
        success: false,
        message: 'Errore durante la rimozione del veicolo',
        error: error.message
      });
    }
  },

  // Operazione 1.d - Ricerca2: visualizzazione veicoli per tipologia con batteria > 20%
  getVehiclesByTypeAndBattery: async (req, res) => {
    try {
      const { type } = req.params;

      const query = `
        SELECT *
        FROM Veicolo_Attivo 
        WHERE Tipologia = ? AND PercentualeBatteria > 20 AND Stato = 'disponibile'
        ORDER BY PercentualeBatteria DESC
      `;

      const [vehicles] = await pool.execute(query, [type]);
      
      return res.status(200).json({
        success: true,
        message: 'Veicoli recuperati con successo',
        count: vehicles.length,
        data: vehicles
      });
    } catch (error) {
      console.error('Errore durante il recupero dei veicoli:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Errore durante il recupero dei veicoli', 
        error: error.message 
      });
    }
  },

  // Operazione 1.e - Visualizzazione dei 5 veicoli più noleggiati nell'ultimo anno per tipologia
  getMostRentedVehiclesByType: async (req, res) => {
    try {
      const { type } = req.params;
      
      const query = `
        SELECT 
            v.ID,
            v.Targa,
            v.Modello,
            v.Marca,
            v.Tipologia,
            COUNT(n.ID) AS NumeroNoleggi
        FROM 
            Veicolo v
        JOIN 
            Noleggia n ON v.ID = n.VeicoloID
        WHERE 
            v.Tipologia = ?
            AND n.DataInizio >= DATE_SUB(CURDATE(), INTERVAL 1 YEAR)
        GROUP BY 
            v.ID, v.Targa, v.Modello, v.Marca, v.Tipologia
        ORDER BY 
            NumeroNoleggi DESC
        LIMIT 5;
      `;
      
      const [vehicles] = await pool.execute(query, [type]);
      
      return res.status(200).json({
        success: true,
        message: 'Veicoli più noleggiati recuperati con successo',
        count: vehicles.length,
        data: vehicles
      });
    } catch (error) {
      console.error('Errore durante il recupero dei veicoli più noleggiati:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Errore durante il recupero dei veicoli più noleggiati', 
        error: error.message 
      });
    }
  },

  // Operazione 1.f - Visualizzazione dei 5 veicoli che hanno ricevuto più interventi di manutenzione nell'ultimo anno
  getMostMaintenanceVehicles: async (req, res) => {
    try {
      const query = `
        SELECT 
            v.ID,
            v.Targa,
            v.Modello,
            v.Marca,
            COUNT(m.ID) AS NumeroInterventi
        FROM
            Veicolo v
        JOIN
            EsegueIntervento m ON v.ID = m.VeicoloID
        WHERE
            m.Data >= DATE_SUB(CURDATE(), INTERVAL 1 YEAR)
        GROUP BY
            v.ID, v.Targa, v.Modello, v.Marca
        ORDER BY
            NumeroInterventi DESC
        LIMIT 5;
      `;
      
      const [vehicles] = await pool.execute(query);
      
      return res.status(200).json({
        success: true,
        message: 'Veicoli con più interventi recuperati con successo',
        count: vehicles.length,
        data: vehicles
      });
    } catch (error) {
      console.error('Errore durante il recupero dei veicoli con più interventi:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Errore durante il recupero dei veicoli con più interventi', 
        error: error.message 
      });
    }
  }
};

module.exports = vehicleController;
