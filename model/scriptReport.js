/**
 * Created by th3ee on 8/30/17.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var scriptSchema = new Schema({
        examID: {type: String},
        meetID: {type: String},
        format: {type: Object},
        completedBy: {type: String},
        major: {type: Boolean}
    }
);
module.exports = mongoose.model('ScriptReport', scriptSchema);