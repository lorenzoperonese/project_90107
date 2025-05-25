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
        StatoAttuale,
        ChilometraggioTotale,
      } = req.body;
      
      console.log('Dati ricevuti:', req.body);
      
      const gpsFormatted = parseGpsString(gpsQuery);
      
      // Campi base sempre presenti
      const baseFields = ['Tipologia', 'Modello', 'Marca', 'PercentualeBatteria', 'GPS', 'StatoAttuale'];
      const baseValues = [Tipologia, Modello, Marca, PercentualeBatteria, gpsFormatted, StatoAttuale];
      
      // Campi condizionali per auto e scooter
      const conditionalFields = [];
      const conditionalValues = [];
      
      if (['auto', 'scooter'].includes(Tipologia)) {
        if (Targa) {
          conditionalFields.push('Targa');
          conditionalValues.push(Targa);
        }
        if (ScadenzaRevisione) {
          conditionalFields.push('ScadenzaRevisione');
          conditionalValues.push(ScadenzaRevisione);
        }
        if (NumeroPolizzaAssicurativa) {
          conditionalFields.push('NumeroPolizzaAssicurativa');
          conditionalValues.push(NumeroPolizzaAssicurativa);
        }
        if (NumeroPosti) {
          conditionalFields.push('NumeroPosti');
          conditionalValues.push(NumeroPosti);
        }
        if (DataImmatricolazione) {
          conditionalFields.push('DataImmatricolazione');
          conditionalValues.push(DataImmatricolazione);
        }
        if (ChilometraggioTotale) {
          conditionalFields.push('ChilometraggioTotale');
          conditionalValues.push(ChilometraggioTotale);
        }
      }
      
      // Costruisci la query dinamicamente
      const allFields = [...baseFields, ...conditionalFields];
      const allValues = [...baseValues, ...conditionalValues];
      
      const placeholders = allFields.map(field => field === 'GPS' ? 'ST_PointFromText(?)' : '?').join(', ');
      const fieldNames = allFields.join(', ');
      
      const query = `INSERT INTO Veicolo (${fieldNames}) VALUES (${placeholders})`;
      
      console.log('Query costruita:', query);
      console.log('Valori per l\'inserimento:', allValues);

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
        StatoAttuale,
        ChilometraggioTotale,
      } = req.body;

      console.log('Dati ricevuti per l\'aggiornamento:', req.body);      
      
      const gpsFormatted = parseGpsString(gpsQuery);
      
      const values = [
        PercentualeBatteria,
        gpsFormatted,
        StatoAttuale,
        ChilometraggioTotale,
        id
      ];

      console.log('Valori per l\'aggiornamento:', values);
      const query = 'UPDATE Veicolo SET PercentualeBatteria = ?, GPS = ST_PointFromText(?), StatoAttuale = ?, ChilometraggioTotale = ? WHERE ID = ?';

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
          statoAttuale: StatoAttuale,
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
      console.log('ID ricevuto per la cancellazione:', id);
      
      const query = 'UPDATE Veicolo SET StatoAttuale = "eliminato" WHERE ID = ?';
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

  // Operazione 1.d - Ricerca1: visualizzazione dei dettagli di un veicolo per targa
  getVehicleByTarga: async (req, res) => {
    try {
      const { targa } = req.params;
      console.log('Targa ricevuta:', targa);
      
      const query = `
        SELECT *
        FROM Veicolo 
        WHERE Targa = ?
      `;
      
      const [vehicles] = await pool.execute(query, [targa]);
      
      if (vehicles.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Veicolo non trovato'
        });
      }
      
      return res.status(200).json({
        success: true,
        message: 'Dettagli veicolo recuperati con successo',
        data: vehicles[0]
      });
    } catch (error) {
      console.error('Errore durante il recupero del veicolo:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Errore durante il recupero del veicolo', 
        error: error.message 
      });
    }
  },

  // Operazione 1.e - Ricerca2: visualizzazione veicoli per tipologia con batteria > 20%
  getVehiclesByTypeAndBattery: async (req, res) => {
    try {
      const { tipologia } = req.params;
      console.log('Tipologia ricevuta:', tipologia);

      const query = `
        SELECT *
        FROM Veicolo 
        WHERE Tipologia = ? AND PercentualeBatteria > 20 AND StatoAttuale = 'disponibile'
        ORDER BY PercentualeBatteria DESC
      `;

      const [vehicles] = await pool.execute(query, [tipologia]);
      
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
  }
};

module.exports = vehicleController;
