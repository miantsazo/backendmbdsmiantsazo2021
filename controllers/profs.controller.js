let Prof = require("../model/prof");

function getProfs(req, res) {
    Prof.find()
    .then(profs => {
        res.send(profs);
    }).catch(err => {
        res.send(err);
    });
}

module.exports = {
    getProfs,
};
