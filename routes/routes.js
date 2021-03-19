const assignmentsController = require('../controllers/assignments.controller');
const authenticationController = require('../controllers/authentication.controller');
const matieresController = require('../controllers/matieres.controller');
const express = require('express');
const router = express.Router();

// Authentication routes
router.post('/signup', authenticationController.signup);
router.post('/login', authenticationController.login);

// Assignments routes
router.get('/assignments', assignmentsController.getAssignments);
router.get('/assignments/:id', assignmentsController.getAssignment);
router.post('/assignments', assignmentsController.postAssignment);
router.put('/assignments', assignmentsController.updateAssignment);
router.delete('/assignments/:id', assignmentsController.deleteAssignment);

//Matieres routes
router.get('/matieres', matieresController.getMatieres);


module.exports = router;