const assignmentsController = require('../controllers/assignments.controller');
const authenticationController = require('../controllers/authentication.controller');
const matieresController = require('../controllers/matieres.controller');
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// Authentication routes
router.post('/signup', authenticationController.signup);
router.post('/login', authenticationController.login);

// Assignments routes
router.get('/assignments', auth.checkAuthorization, assignmentsController.getAssignments);
router.get('/assignments/:id', auth.checkAuthorization, assignmentsController.getAssignment);
router.post('/assignments', auth.checkAuthorization, assignmentsController.postAssignment);
router.put('/assignments', auth.checkAuthorization, assignmentsController.updateAssignment);
router.delete('/assignments/:id', auth.checkAuthorization, assignmentsController.deleteAssignment);

//Matieres routes
router.get('/matieres', auth.checkAuthorization, matieresController.getMatieres);


module.exports = router;