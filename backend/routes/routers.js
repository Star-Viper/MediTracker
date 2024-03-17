const express = require('express');
const router = express.Router();
const service = require('../controllers/service');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/setpatient', service.setpatients);
router.put('/editpatient', service.editpatients);
router.post('/setdoctor', service.setdoctors);
router.put('/editdoctor', service.editdoctors);
router.post('/setappointment', service.setappointments);
router.put('/editappointment', service.editappointments);
router.get('/getpatient', service.getpatients);
router.get('/getdoctor', service.getdoctors);
router.get('/getappointment', service.getappointments);


module.exports = router;