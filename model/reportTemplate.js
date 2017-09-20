var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var reporttemplateSchema = new Schema({
    uuid: {type: String},
    name: {type: String},
    report: {type: String},
    declares: {type: String}
});

module.exports = mongoose.model('templates',reporttemplateSchema);