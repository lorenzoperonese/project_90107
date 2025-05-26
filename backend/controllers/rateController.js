const { pool } = require('../config/database');

const tariffeController = {
  // Operazione 8.a - Modifica: modifica della tariffa di una certa tipologia di veicolo
  updateTariffa: async (req, res) => {
    try {
      const { categoria } = req.params;
      const decodedCategoria = decodeURIComponent(categoria);
      const { CostoAlMinuto } = req.body;

      const query = `UPDATE Tariffa SET CostoAlMinuto = ? WHERE CategoriaVeicolo = ?`;
      const [result] = await pool.execute(query, [CostoAlMinuto, decodedCategoria]);

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: 'Tariffa non trovata per questa categoria di veicolo'
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Tariffa aggiornata con successo',
        data: { 
          CategoriaVeicolo: decodedCategoria,
          CostoAlMinuto
        }
      });
    } catch (error) {
      console.error('Errore durante l\'aggiornamento della tariffa:', error);
      return res.status(500).json({
        success: false,
        message: 'Errore durante l\'aggiornamento della tariffa',
        error: error.message
      });
    }
  }
};

module.exports = tariffeController; 