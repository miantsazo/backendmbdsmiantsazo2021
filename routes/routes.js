const assignmentsController = require('../controllers/assignments.controller');
const authenticationController = require('../controllers/authentication.controller');
const matieresController = require('../controllers/matieres.controller');
const profsController = require('../controllers/profs.controller');
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
router.get('/matieres/:id', auth.checkAuthorization, matieresController.getMatiere);
router.post('/matieres', auth.checkAuthorization, matieresController.addMatiere);
router.put('/matieres', auth.checkAuthorization, matieresController.updateMatiere);
router.delete('/matieres/:id', auth.checkAuthorization, matieresController.deleteMatiere);

// Profs routes
router.get('/profs', auth.checkAuthorization, profsController.getProfs);


module.exports = router;