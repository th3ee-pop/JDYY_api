var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var reporttemplateSchema = new Schema({
    uuid: {type: String},
    name: {type: String},
    hReportEvidences: {type: String},
    hReportConclusion: {type: String}
});

module.exports = mongoose.model('templates',reporttemplateSchema);