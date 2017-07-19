/**
 * Created by th3ee on 6/25/17.
 */
/**
 * Created by th3ee on 6/21/17.
 */
/**
 * Created by th3ee on 6/4/17.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var reportRecordSchema = new Schema({
        examID: {type: String},
        operate_type: {type: String},
        name: {type: String},
        date: {type: String}
    }
);



module.exports = mongoose.model('ReportRecord', reportRecordSchema);