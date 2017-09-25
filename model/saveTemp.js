
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var tempSchema = new Schema(
    {
       tempName: String,
       hospital: String,
       format: Object
    }
);

module.exports = mongoose.model('temp', tempSchema);