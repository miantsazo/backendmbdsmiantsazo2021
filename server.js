const express = require("express");
const path = require("path");
const cors = require('cors')
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const routes = require("./routes/routes");
const app = express();
const auth = require('./middleware/auth');

mongoose.Promise = global.Promise;

// remplacer toute cette chaine par l'URI de connexion à votre propre base dans le cloud s
const uri =
  "mongodb+srv://miantsazo:miantsazo@cluster0.5mkcd.mongodb.net/assignments?retryWrites=true&w=majority";

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
};

mongoose.connect(uri, options).then(
  () => {
    console.log("Connecté à la base MongoDB assignments dans le cloud !");
    console.log("at URI = " + uri);
    console.log(
      "vérifiez with http://localhost:8010/api/assignments que cela fonctionne"
    );
  },
  (err) => {
    console.log("Erreur de connexion: ", err);
  }
);

app.use(cors());

// Pour les formulaires
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

let port = process.env.PORT || 8010;

// les routes
const prefix = "/api";
app.use(prefix, routes);

app.use(express.static('public'));

// On démarre le serveur
app.listen(port, "0.0.0.0");
console.log("Serveur démarré sur http://localhost:" + port);

module.exports = app;
