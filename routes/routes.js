const assignmentsController = require('../controllers/assignments.controller');
const authenticationController = require('../controllers/authentication.controller');
const matieresController = require('../controllers/matieres.controller');
const profsController = require('../controllers/profs.controller');
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
//https://www.djamware.com/post/5f0533338ce55338fd15aca3/mean-stack-angular-10-tutorial-upload-image-file
var multer  = require('multer')
router.use(express.static('uploads'));
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        console.log("req : " + req);
        cb(null, './public/uploads');
    },
    filename: (req, file, cb) => {
        console.log(file);
        var filetype = '';
        if (file.mimetype === 'image/gif') {
            filetype = 'gif';
        }
        if (file.mimetype === 'image/png') {
            filetype = 'png';
        }
        if (file.mimetype === 'image/jpeg') {
            filetype = 'jpg';
        }
        cb(null, 'image-' + Date.now() + '.' + filetype);
    }
});

var upload = multer({ storage: storage });

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
router.get('/profs/:id', auth.checkAuthorization, profsController.getProf);
router.delete('/profs/:id', auth.checkAuthorization, profsController.deleteProf);
router.put('/profs', auth.checkAuthorization, upload.single('photo'), profsController.updateProf);
router.post('/profs', auth.checkAuthorization,upload.single('photo'), profsController.addProf)


module.exports = router;