/**
 * Created by th3ee on 6/21/17.
 */
/**
 * Created by th3ee on 6/4/17.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var reportSchema = new Schema({
        patientID: {type: String},
        examID: {type: String},
        name: {type: String},
        gender: {type: String},
        age: {type: String},
        office: {type: String},
        examContent: {type: String},
        examPart: {type: String},
        date: {type: String},
        reporttime: {type: String},
        description: {type: String},
        diagnosis: {type: String},
        status: {type: String},
        reportDoc: {type: String},
        verifyDoc: {type: String},
    }
);



module.exports = mongoose.model('Report', reportSchema);