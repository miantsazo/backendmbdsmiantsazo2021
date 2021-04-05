const { ObjectId } = require("bson");
const assignment = require("../model/assignment");

let Matiere = require("../model/matiere");

function getMatieres(req, res) {
    var aggregateQuery = Matiere.aggregate([
        {
            "$lookup": {
                "from": "prof",
                "localField": "prof",
                "foreignField": "_id",
                "as": "prof"
            }
        },
    ]);
    if (req.query.page) {
        Matiere.aggregatePaginate(
            aggregateQuery, {
            page: parseInt(req.query.page) || 1,
            limit: parseInt(req.query.limit) || 10,
        })
            .then(matieres => {
                res.send(matieres);
            }).catch(err => {
                res.status(500).json({
                    message: "Une erreur est survenue, veuillez réessayer"
                })
            });
    } else {
        aggregateQuery.then(matieres => {
            res.send(matieres);
        }).catch(err => {
            res.status(500).json({
                message: "Une erreur est survenue, veuillez réessayer"
            })
        });
    }
}

function getMatiere(req, res) {
    let matiereId = req.params.id;

    Matiere.aggregate([
        {
            $match: {
                _id: {
                    $in: [ObjectId(matiereId)]
                }
            }
        },
        {
            "$lookup": {
                "from": "prof",
                "localField": "prof",
                "foreignField": "_id",
                "as": "prof"
            }
        },
    ]).then(response => {
        res.send(response)
    }).catch(err => {
        res.status(500).json({
            message: "Une erreur est survenue, veuillez réessayer"
        })
    });
}

function updateMatiere(req, res) {
    Matiere.findByIdAndUpdate(
        req.body._id,
        req.body,
        { new: true },
        (err, matiere) => {
            if (err) {
                res.status(500).json({
                    message: "Une erreur est survenue, modification non effectuée"
                })
            } else {
                res.json({ message: "Modification effectuée" });
            }
        }
    );
}

function deleteMatiere(req, res) {
    assignment.exists({ matiere: req.params.id }).then(response => {
        if (response) {
            res.status(409).json({
                message: "Vous ne pouvez pas supprimé une matière lié à un assignment"
            })
        } else {
            Matiere.findByIdAndRemove(req.params.id, (err, matiere) => {
                if (err) {
                    res.status(500).json({
                        message: "Une erreur est survenue, veuillez réessayer"
                    })
                }
                res.json({ message: `${matiere.libelle} supprimé` });
            });
        }
    })
}

function addMatiere(req, res) {
    let matiere = new Matiere();
    matiere.libelle = req.body.libelle;
    matiere.prof = req.body.prof._id;

    matiere.save((err) => {
        if (err) {
            res.status(500).json({
                message: "Une erreur est survenue, veuillez réessayer"
            })
        }
        res.json({ message: `${matiere.libelle} enregistré avec succes !` });
    });
}

module.exports = {
    getMatieres,
    getMatiere,
    updateMatiere,
    deleteMatiere,
    addMatiere
};
