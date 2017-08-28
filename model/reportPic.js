/**
 * Created by th3ee on 8/28/17.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var reportSchema = new Schema({
    examID: {type: String},
    picID: {type: String}
    }
);



module.exports = mongoose.model('reportPic', reportSchema);