/**
 * Created by th3ee on 6/4/17.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var heroSchema = new Schema({
    patientID: {type: String},
    examID: {type: String},
    name: {type: String},
    gender: {type: String},
    age: {type: String},
    reason: {type: String},
    od: {type: String},
    status: {type: String},
    transferstatus: {type: String},
    destination: {type: String},
    applyDoc: {type: String},
    user: {type: Array},
    time: {type: String},
    applytime: {type: String},
    examContent: {type: String},
    examPart: {type: String}
    }
);



module.exports = mongoose.model('Hero', heroSchema);