var mongoose = require("mongoose");


var Schema = mongoose.Schema;


var SwordCategorySchema = new Schema({
    division: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String
    }
});

var SwordCategory = mongoose.model("SwordCategory", SwordCategorySchema);

// Export the Article model
module.exports = SwordCategory;