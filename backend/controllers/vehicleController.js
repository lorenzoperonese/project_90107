const { pool } = require('../config/database');
const { parseGpsString } = require('../utils/gpsUtils');

const vehicleController = {
  // Operazione 1.d e 1.e
  getVehicles: async (req, res) => {
  try {
    if (req.query.targa) {
      const targa = req.query.targa;
      console.log('Targa ricevuta:', targa);
      const query = 'SELECT * FROM Veicolo WHERE Targa = ?';
      const [vehicles] = await pool.execute(query, [targa]);
      return res.status(200).json({
        success: true,
        message: 'Veicoli recuperati con successo (per targa)',
        count: vehicles.length,
        data: vehicles
      });
    } else if (req.query.tipologia) {
      const tipologia = req.query.tipologia;
      const stato = req.query.stato;
      const batteria = req.query.batteria;
      console.log('Tipologia ricevuta:', tipologia, 'Stato:', stato, 'Batteria:', batteria);

      let query = 'SELECT * FROM Veicolo WHERE Tipologia = ?';
      const params = [tipologia];

      if (stato) {
        query += ' AND StatoAttuale = ?';
        params.push(stato);
      } 

      if (batteria) {
        query += ' AND PercentualeBatteria > ?';
        params.push(Number(batteria));
      } 

      const [vehicles] = await pool.execute(query, params);
      console.log('Query eseguita:', query);
      console.log('Veicoli recuperati:', vehicles);
      return res.status(200).json({
        success: true,
        message: 'Veicoli recuperati con successo (per tipologia)',
        count: vehicles.length,
        data: vehicles
      });
    } else {
      return res.status(400).json({
        success: false,
        message: 'Parametro targa o tipologia mancante'
      });
    }
  } catch (error) {
    console.error('Errore durante il recupero dei veicoli:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Errore durante il recupero dei veicoli', 
      error: error.message 
    });
  }
},

  

  // Operazione 1.b
  updateRecord: async (req, res) => {
    try {
      const { id } = req.params;
      const {
        PercentualeBatteria,
        GPS,
        StatoAttuale,
        ChilometraggioTotale,
      } = req.body;

      const campiObbligatori = [
      'PercentualeBatteria',
      'GPS',
      'StatoAttuale',
      'ChilometraggioTotale'
    ];
    const campiMancanti = campiObbligatori.filter(campo => req.body[campo] === undefined || req.body[campo] === null);

    if (campiMancanti.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Campi obbligatori mancanti: ${campiMancanti.join(', ')}`
      });
    }
      

      console.log('Dati ricevuti per l\'aggiornamento:', req.body);      
      
      const gpsQuery = parseGpsString(GPS); 
      const values = [
        PercentualeBatteria,
        gpsQuery,
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
          message: 'Record non trovato'
        });
      }
      return res.status(200).json({
        success: true,
        message: 'Record aggiornato con successo',
        data: {
          id: id,
          percentualeBatteria: PercentualeBatteria,
          statoAttuale: StatoAttuale,
          chilometraggioTotale: ChilometraggioTotale
        }
      });

    } catch (error) {
      console.error('Errore durante l\'aggiornamento del record:', error);
      return res.status(500).json({
        success: false,
        message: 'Errore durante l\'aggiornamento del record',
        error: error.message
      });
    }
  },
  
  // Operazione 1.a
  insertRecord: async (req, res) => {
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
        GPS,
        StatoAttuale,
        ChilometraggioTotale,
      } = req.body;
      
      console.log('Dati ricevuti:', req.body);
      
      // Valida i dati di input
      const campiObbligatori = [
        'Targa', 
        'Tipologia', 
        'NumeroPolizzaAssicurativa', 
        'Modello', 
        'Marca', 
      ];
      
      const campiMancanti = campiObbligatori.filter(campo => !req.body[campo]);
      
      if (campiMancanti.length > 0) {
        return res.status(400).json({
          success: false,
          message: `Campi obbligatori mancanti: ${campiMancanti.join(', ')}`
        });
      }
      
      const gpsQuery = parseGpsString(GPS);
      const values = [
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
      ];
      console.log('Valori per l\'inserimento:', values);

      const query = 'INSERT INTO Veicolo (Targa, Tipologia, ScadenzaRevisione, NumeroPolizzaAssicurativa, Modello, Marca, NumeroPosti, DataImmatricolazione, PercentualeBatteria, GPS, StatoAttuale, ChilometraggioTotale) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ST_PointFromText(?), ?, ?)'; 
      const [result] = await pool.execute(query, values);
      
      return res.status(201).json({
        success: true,
        message: 'Veicolo inserito con successo',
        data: {
          id: result.insertId,
          targa: Targa,
          tipologia: Tipologia,
          modello: Modello,
          marca: Marca
        }
      });
    } catch (error) {
      console.error('Errore durante l\'inserimento del record:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Errore durante l\'inserimento del record', 
        error: error.message 
      });
    }
  },


  // Operazione 1.c 

  deleteRecord: async (req, res) => {
    try {
      const { id } = req.params;
      console.log('ID ricevuto per la cancellazione:', id);
      
      const query = 'UPDATE Veicolo SET StatoAttuale = "non disponibile" WHERE ID = ?';
      const [result] = await pool.execute(query, [id]);
      
      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: 'Record non trovato'
        });
      }
      
      return res.status(200).json({
        success: true,
        message: 'Record eliminato con successo'
      });
    } catch (error) {
      console.error('Errore durante l\'eliminazione del record:', error);
      return res.status(500).json({
        success: false,
        message: 'Errore durante l\'eliminazione del record',
        error: error.message
      });
    }
  }
};

module.exports = vehicleController;
