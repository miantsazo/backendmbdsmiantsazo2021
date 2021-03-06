const { ObjectId } = require("bson");
let Assignment = require("../model/assignment");
const matiere = require("../model/matiere");

function getAssignments(req, res) {
    var match = [{
        "$match": {
            "rendu": req.query.rendu === 'true'
        },
    },
    {
        // https://docs.mongodb.com/manual/reference/operator/aggregation/lookup/
        "$lookup": {
            "from": "matieres",
            "localField": "matiere",
            "foreignField": "_id",
            "as": "matiere"
        }
    },
    {
        "$lookup": {
            "from": "prof",
            "localField": "matiere.prof",
            "foreignField": "_id",
            "as": "prof"
        }
    }];
    if (req.query.q != null) {
        match.push({
            "$match": {
                "nom": {
                    "$regex": req.query.q,
                    "$options": "i"
                }
            },
        })
    }
    var aggregateQuery = Assignment.aggregate(match);
    Assignment.aggregatePaginate(
        aggregateQuery,
        {
            page: parseInt(req.query.page) || 1,
            limit: parseInt(req.query.limit) || 10,
        }
    ).then(assignments => {
        res.send(assignments);
    }).catch(err => {
        res.send(err);
    });
}

// Récupérer un assignment par son id (GET)
function getAssignment(req, res) {
    let assignmentId = req.params.id;

    Assignment.aggregate([
        {
            $match: {
                _id: {
                    $in: [ObjectId(assignmentId)]
                }
            }
        },
        {
            // https://docs.mongodb.com/manual/reference/operator/aggregation/lookup/
            "$lookup": {
                "from": "matieres",
                "localField": "matiere",
                "foreignField": "_id",
                "as": "matiere"
            }
        },
        {
            "$lookup": {
                "from": "prof",
                "localField": "matiere.prof",
                "foreignField": "_id",
                "as": "prof"
            }
        },
    ]).then(response => {
        if (response.length == 0) {
            res.status(404).json({
                message: "Assignment inexistant"
            })
        }
        else {
            res.send(response)
        }
    }).catch(err => {
        res.status(500).json({
            message: "Une erreur est survenue, veuillez réessayer"
        })
    });

}

// Ajout d'un assignment (POST)
function postAssignment(req, res) {
    let assignment = new Assignment();
    assignment.id = req.body.id;
    assignment.nom = req.body.nom;
    assignment.dateDeRendu = req.body.dateDeRendu;
    assignment.rendu = req.body.rendu;
    assignment.auteur = req.body.auteur;
    assignment.matiere = req.body.matiere._id;
    assignment.note = req.body.note;
    assignment.remarques = req.body.remarques;

    assignment.save((err) => {
        if (err) {
            res.status(500).json({
                message: "Une erreur est survenue, veuillez réessayer"
            })
        }
        res.json({ message: 'Assignment ajouté' });
    });
}

// Update d'un assignment (PUT)
function updateAssignment(req, res) {
    Assignment.findByIdAndUpdate(
        req.body._id,
        req.body,
        { new: true },
        (err, assignment) => {
            if (err) {
                res.status(500).json({
                    message: "Une erreur est survenue, veuillez réessayer"
                })
            } else {
                res.json({ message: "Modification effectuée" });
            }
        }
    );
}

// suppression d'un assignment (DELETE)
function deleteAssignment(req, res) {
    Assignment.findByIdAndRemove(req.params.id, (err, assignment) => {
        if (err) {
            res.status(500).json({
                message: "Une erreur est survenue, veuillez réessayer"
            })
        }
        res.json({ message: `${assignment.nom} supprimé` });
    });
}

module.exports = {
    getAssignments,
    postAssignment,
    getAssignment,
    updateAssignment,
    deleteAssignment,
};
