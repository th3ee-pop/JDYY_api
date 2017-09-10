/**
 * Created by th3ee on 6/23/17.
 */
/**
 * Created by th3ee on 6/4/17.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var itemSchema = new Schema({
        patientID: {type: String},
        examID: {type: String},
        name: {type: String},
        gender: {type: String},
        age: {type: String},
        examContent: {type: String},
        examPart: {type: String},
        sendHospital: {type: String},
        destination: {type: String},
        reportDoc: {type: String},
        reporttime: {type: String},
        time: {type: String},
        status: {type: String},
        applyDoc: {type: String},
        transReason: {type: String},
        applystatus: {type: String},
        transferstatus: {type: String},
        rejection: {type: String},
        owner: {type: String},
        responsible: {type: String},
        origin: {type: String},
        screenShot: {type: Array}
    }
);



module.exports = mongoose.model('Item', itemSchema);