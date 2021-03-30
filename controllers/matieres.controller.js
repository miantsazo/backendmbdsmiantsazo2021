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
                res.send(err);
            });
    } else {
        aggregateQuery.then(matieres => {
            res.send(matieres);
        }).catch(err => {
            res.send(err);
        });
    }
}

module.exports = {
    getMatieres,
};
