/**
 * Created by th3ee on 9/17/17.
 */
var mongoose = require('mongoose');
var jwt = require('jwt-simple');
var nodemailer = require('nodemailer');
var temp = require('../model/saveTemp');
var template = require('../model/template');
var config = require('../config/database');
var ejs = require('ejs');
var Schema = mongoose.Schema;

var sendJSONresponse = function (res, status, content) {
    res.status(status);
    res.json(content);
};

var createSchema = function (attributes) {
    console.log(attributes);
    var targetSchema = {};
    attributes.forEach(function (attr) {
        console.log(attr.name);
        if (attr.name === 'diagnosis')
        {
            targetSchema['diagnosis'] = attr.type;
        } else if (attr.name === 'description') {
            targetSchema['description'] = attr.type;
        } else {
            targetSchema[attr.name] = attr.type;
        }

    });
    console.log(targetSchema);
    return targetSchema;
};

var compileModel = function (tempName) {
   return template.findOne({'templateName': tempName}).exec(function (err, temp) {
        if (newSchema && compiledSchema !== SchemaToCompile) {
          //  mongoose.model(tempName, new Schema(temp.attributes));
            mongoose.model(tempName, new Schema(createSchema(temp.attributes)));
            newSchema = false;
            compiledSchema = tempName;
            SchemaToCompile = '';
        } else if(compiledSchema === SchemaToCompile){
           // newSchema = false;
            compiledSchema = tempName;
        } else {
            console.log('already compiled');
        }
    })
};

var senderror = function (err, res) {
    return res.status(403).send({msg: 'Something Wrong', error: err});
};

var newSchema = true;
var SchemaToCompile = '';
var compiledSchema = '';

var functions = {

    saveSchema: function (req, res) {
        console.log(req.body);
            var Template = temp({
                tempName: req.body.tempName,
                format: req.body.format
            });
            console.log(Template);
           var promise = temp.findOne({'tempName':req.body.tempName}).exec(function(err, template){
                if (template) {
                    temp.findOneAndRemove({'tempName': req.body.tempName}).exec(function () {
                        console.log('temp covered');
                    })
                } else {
                    console.log('new temp');
                }
            });
        promise.then(function(){
            Template.save(function(err){
                if (err){
                    res.json({success:false, msg:'Failed to save'})
                }

                else {
                    res.json({success:true, msg:'Successfully saved'});
                }
            })
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
        newSchema = true;
        SchemaToCompile = req.body.templateName;
        compiledSchema = '';
        var inital_temp = template(req.body);
        var promise = template.findOne({'templateName':req.body.templateName}).exec(function (err, temp) {
            if (temp) {
                template.findOneAndRemove({'templateName':req.body.templateName}).exec(function (err) {
                    if (err) senderror(err);
                    else console.log('delete success');
                })
            } else {
                console.log('inital schema')
            }
        });
        promise.then(function(){
            inital_temp.save(function (err) {
                if (err) senderror(err);
                else sendJSONresponse(res, 200, {success:true})
            })
        })
    },
    getSchema: function (req, res) {
        template.findOne({'templateName': req.body.templateName}).exec(function (err, temp) {
            if (err) senderror(err);
            else sendJSONresponse(res, 200, temp);
        })
    },

    getTheReport: function (req, res) {
        var conn = mongoose.connect('mongodb://localhost:27017');
        console.log(compileModel(req.body.templateName));
        compileModel(req.body.templateName).then(function () {
            conn.model(req.body.templateName).find().exec(function (err, doc) {
                if(err) senderror(err);
                else sendJSONresponse(res, 200, doc);
            })
        });
    },

    SaveReport: function (req, res) {
        compileModel(req.body.templateName).then(function () {
            var conn = mongoose.connect('mongodb://localhost:27017');
            var Model = conn.model(req.body.templateName);
            console.log(Model(createSchema(req.body.attributes)));
            Model(createSchema(req.body.attributes)).save(function (err) {
                if (err) senderror(err, res);
                else sendJSONresponse(res, 200, {save_success:true})
            })
        });
    },

    deleteTempReport: function (req, res) {
        var conn = mongoose.connect('mongodb://localhost:27017');
        console.log(compileModel(req.body.templateName));
        compileModel(req.body.templateName).then(function () {
            conn.model(req.body.templateName).remove().exec(function (err) {
                if(err) senderror(err ,res);
                else sendJSONresponse(res, 200, {delete_success:true});
            })
        });
    },

    getTemplate: function (req, res) {
        template.find().exec(function (err, temps) {
            if (err) senderror(err,res);
            else sendJSONresponse(res, 200, temps)
        })
    }
};



module.exports = functions;
