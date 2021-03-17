let mongoose = require("mongoose");
var aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const prof = require("./prof");
let Schema = mongoose.Schema;

let MatiereSchema = Schema({
  libelle: String,
  prof: {
    type: mongoose.Schema.Types.ObjectId, ref: 'Prof'
  },
});

MatiereSchema.plugin(aggregatePaginate);
// C'est à travers ce modèle Mongoose qu'on pourra faire le CRUD
module.exports = mongoose.model("Matiere", MatiereSchema);
