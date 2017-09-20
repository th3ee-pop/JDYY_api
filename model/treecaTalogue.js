var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var treecatalogueSchema = new Schema({
    name: {type: String},
    tree: {type: String}
});

module.exports = mongoose.model('treecatalogue',treecatalogueSchema);