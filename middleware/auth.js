const jwt = require('jsonwebtoken');
const config = require('../config');

function checkAuthorization(req, res, next) {
    const header = req.headers.authorization;
    if (header == null) {
        return res.status(401).json({
            message: "Veuillez vous connecter"
        })
    }
    const token = header.split(" ")[1];
    if (token == null) {
        return res.status(401).json({
            message: "Session expirée"
        })
    }

    jwt.verify(token, config.SECRET, (err, verified) => {
        if (err) {
            return res.status(401).json({
                message: "Token invalide"
            });
        }
        next();
    });
}

module.exports = {
    checkAuthorization
}