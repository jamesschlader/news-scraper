var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

var SwordsSchema = new Schema({
  name: {
    type: String,
    unique: true
  },
  link: {
    type: String,
    uique: true
  },
  image: {
    type: String
  },
  Overallength: {
    type: String
  },
  BladeLength: {
    type: String
  },
  Bladewidth: {
    type: String
  },
  CoB: {
    type: String
  },
  CoP: {
    type: String
  },
  Weight: {
    type: String
  },

  note: {
    type: Schema.Types.ObjectId,
    ref: "Note"
  }
});

var Swords = mongoose.model("Sword", SwordsSchema);

module.exports = Swords;
