/**
 * Created by th3ee on 9/18/17.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var tempSchema = new Schema(
    {
        templateName: String,
        attributes: Object
    }
);

module.exports = mongoose.model('template', tempSchema);