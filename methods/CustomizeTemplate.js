/**
 * Created by th3ee on 9/17/17.
 */
var mongoose = require('mongoose');
var config = require('../config/database');
var jwt = require('jwt-simple');
var nodemailer = require('nodemailer');
var temp = require('../model/saveTemp');
var ejs = require('ejs');
var Schema = mongoose.Schema;

var sendJSONresponse = function (res, status, content) {
    res.status(status);
    res.json(content);
};

var senderror = function (err) {
    return res.status(403).send({msg: 'Something Wrong', error: err});
};

var functions = {
    
    saveSchema: function (req, res) {
        console.log(req.body);
            var Template = temp({
                tempName: req.body.tempName,
                format: req.body.format
            });
            console.log(Template);
        Template.save(function(err){
            if (err){
                res.json({success:false, msg:'Failed to save'})
            }

            else {
                res.json({success:true, msg:'Successfully saved'});
            }
        })
    },
    
    getModel: function (req ,res) {
        temp.findOne({'tempName': req.body.tempName}).exec(function (err, temp) {
            if (err) senderror(err);
            else sendJSONresponse(res, 200, temp);
        })
    },

    getAllModel: function (req ,res) {
        temp.find().exec(function (err, temps) {
            if (err) senderror(err);
            else sendJSONresponse(res, 200, temps);
        })
    },

    deleteModel: function (req ,res) {
        temp.remove().exec(function (err) {
            if (err) senderror(err);
            else sendJSONresponse(res, 200, {delete_success: true});
        })
    },
    
    createSchema: function (req, res) {
        var schema = new Schema({

        });
        module.exports = mongoose.model(req.body.name, schema);
        sendJSONresponse(res, 200, {success: true});
    }
};

module.exports = functions;
