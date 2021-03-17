const User = require('../model/user');
const config = require('../config');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

function signup(req, res) {
    bcrypt.hash(req.body.password, 10, (err, hash) => {
        const user = new User({
            lastName: req.body.lastname,
            firstName: req.body.firstname,
            username: req.body.username,
            password: hash,
            isAdmin: true,
        });

        User.findOne({ username: req.body.username }, (err, user1) => {
            if (err) {
                res.send(err);
            }

            if (user1) {
                return res.status(401).json({
                    message: "Utilisateur existant"
                })
            }

            user.save((err) => {
                if (err) {
                    return res.status(500).json({
                        message: "Une erreur est survenue lors de la creation de l'utilusateur"
                    })
                }
                res.status(201).json({
                    message: "Utilisateur créé avec succès",
                    result: user1
                });
            })

        })
    })
}

function login(req, res) {
    let fetchedUser;

    User.findOne({ username: req.body.username }, (err, user) => {
        if (err) {
            res.send(err);
        }

        if (!user) {
            return res.status(401).json({
                message: "Aucun utilisateur correspondant"
            })
        }
        fetchedUser = user;
        return bcrypt.compare(req.body.password, user.password, (err, same) => {
            if (!same) {
                return res.status(401).json({
                    message: "Mot de passe incorrect"
                })
            }

            const token = jwt.sign(
                { username: fetchedUser.username, userId: fetchedUser._id },
                config.SECRET,
                { expiresIn: "2h" }
            );
            res.status(200).json({
                token: token,
                expiresIn: 7200,
                userId: fetchedUser._id
            });
        });

    })
}

function checkAuthorization(req, res, next) {
    const header = req.headers.authorization;
    const token = header.split(" ")[1];

    if (token == null) {
        return res.status(401).json({
            message: "Session expirée"
        })
    }

    jwt.verify(token, config.SECRET).then(user => {
        // req.userData = {
        //     username: checkedToken.username,
        //     userId = checkedToken.userId
        // }

        req.user = user;
        next();
    })
}

module.exports = {
    signup,
    login,
    checkAuthorization
};