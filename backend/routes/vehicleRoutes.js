const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicleController');

router.get('/', vehicleController.getVehicles);

router.post('/', vehicleController.insertRecord);
router.post('/:id', vehicleController.updateRecord);
router.delete('/:id', vehicleController.deleteRecord);

module.exports = router;
