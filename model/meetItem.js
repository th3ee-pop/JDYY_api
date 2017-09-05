/**
 * Created by th3ee on 8/29/17.
 */
/**
 * Created by th3ee on 6/23/17.
 */
/**
 * Created by th3ee on 6/4/17.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var meetSchema = new Schema({
        examID: {type: String},
        meetID: {type: String},
        title: {type: String},
        date: {type: String},
        owner: {type: String},
        cooperator: {type: Array},
        status: {type: String},
        reason: {type: String}
    }
);



module.exports = mongoose.model('meetItem', meetSchema);