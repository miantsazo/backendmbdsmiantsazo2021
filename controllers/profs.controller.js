let Prof = require("../model/prof");
let Matiere = require("../model/matiere");
const { response } = require("express");


function getProfs(req, res) {
    var aggregateQuery = Prof.find();
    if (req.query.page) {
        Prof.aggregatePaginate(
            aggregateQuery, {
            page: parseInt(req.query.page) || 1,
            limit: parseInt(req.query.limit) || 10,
        })
            .then(profs => {
                res.send(profs);
            }).catch(err => {
                res.status(500).json({
                    message: "Une erreur est survenue, veuillez réessayer"
                })
            });
    } else {
        aggregateQuery.then(profs => {
            res.send(profs);
        }).catch(err => {
            res.status(500).json({
                message: "Une erreur est survenue, veuillez réessayer"
            })
        });
    }
}

function getProf(req, res) {
    let profId = req.params.id;

    Prof.findById(profId)
        .then(response => {
            res.send(response)
        }).catch(err => {
            res.status(500).json({
                message: "Une erreur est survenue, veuillez réessayer"
            })
        });
}

function updateProf(req, res) {
    if(req.file) {
        req.body.photoUrl = req.file.filename;
    }
    console.log(req.body);
    Prof.findByIdAndUpdate(
        req.body._id,
        req.body,
        { new: true },
        (err) => {
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

function deleteProf(req, res) {
    Matiere.exists({ prof: req.params.id }).then(response => {
        if (response) {
            res.status(409).json({
                message: "Vous ne pouvez pas supprimé un prof lié à une matière"
            })
        } else {
            Prof.findByIdAndRemove(req.params.id, (err, prof) => {
                if (err) {
                    res.status(500).json({
                        message: "Une erreur est survenue, veuillez réessayer"
                    })
                }
                res.json({ message: `${prof.prenom + " " + prof.nom} supprimé` });
            });
        }
    })
}

function addProf(req, res) {
    if (!req.file) {
        return res.status(500).send({ message: "Image obligatoire" })
    }
    let prof = new Prof();
    prof.nom = req.body.nom;
    prof.prenom = req.body.prenom;
    prof.photoUrl = req.file.filename;
    prof.save((err) => {
        if (err) {
            res.status(500).json({
                message: "Une erreur est survenue, veuillez réessayer"
            })
        }
        res.json({ message: 'Prof enregistré avec succes' });
    });
}

module.exports = {
    getProfs,
    getProf,
    updateProf,
    deleteProf,
    addProf
};
