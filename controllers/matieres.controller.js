let Matiere = require("../model/matiere");

function getMatieres(req, res) {
    Matiere.aggregate([
        {
            "$lookup": {
                "from": "prof",
                "localField": "prof",
                "foreignField": "_id",
                "as": "prof"
            }
        },
    ])
    .then(matieres => {
        res.send(matieres);
    }).catch(err => {
        res.send(err);
    });
}

module.exports = {
    getMatieres,
};
