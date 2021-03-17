let mongoose = require("mongoose");
var aggregatePaginate = require("mongoose-aggregate-paginate-v2");
let Schema = mongoose.Schema;

let UserSchema = Schema({
  lastName: String,
  firstName: String,
  username: String,
  password: String,
  isAdmin: Boolean,
});

UserSchema.plugin(aggregatePaginate);

module.exports = mongoose.model("Users", UserSchema);
