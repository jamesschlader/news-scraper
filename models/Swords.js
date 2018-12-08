var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

var SwordsSchema = new Schema({
  category: {
    type: Schema.Types.ObjectId,
    ref: "SwordCategory"
  },
  link: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String
  },
  image: {
    type: String
  },
  overallLength: {
    type: Number
  },
  bladeLength: {
    type: Number
  },
  bladeWidth: {
    type: Number
  },
  centerOfPercussion: {
    type: Number
  },
  centerOfBalance: {
    type: Number
  },
  weight: {
    type: Number
  },
  note: {
    type: Schema.Types.ObjectId,
    ref: "Note"
  }
});

var Swords = mongoose.model("Swords", SwordsSchema);

module.exports = Swords;
