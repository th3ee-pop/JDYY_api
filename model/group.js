/**
 * Created by th3ee on 6/29/17.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var groupSchema = new Schema({
        name: {type: String, required: true},
        reportAct: {type: Array},
        members: {type: Array},
        description: {type: String},
    }
);



module.exports = mongoose.model('Group', groupSchema);