/**
 * Created by th3ee on 9/25/17.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var newReportSchema = new Schema(
    {
        examID: String,
        format: Object,
        reportDoc: String,
        verifyDoc: String,
        initial: Boolean
    }
);

module.exports = mongoose.model('newReport', newReportSchema);