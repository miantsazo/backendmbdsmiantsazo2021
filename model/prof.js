let mongoose = require("mongoose");
var aggregatePaginate = require("mongoose-aggregate-paginate-v2");
let Schema = mongoose.Schema;

let ProfSchema = Schema({
  nom: String,
  prenom: String,
  photoUrl: String
}, {
  collection: 'prof'
});

ProfSchema.plugin(aggregatePaginate);
// C'est à travers ce modèle Mongoose qu'on pourra faire le CRUD
module.exports = mongoose.model("Prof", ProfSchema);
