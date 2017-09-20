var TreeCatalogue = require('../model/treecaTalogue');
var ReportTemplate = require('../model/reportTemplate');
var User = require('../model/user');
var Item = require('../model/item');
var ReportPic = require('../model/reportPic');
var Script = require('../model/scriptReport');
var mongoose = require('mongoose');
var jwt = require('jwt-simple');
var nodemailer = require('nodemailer');
var ejs = require('ejs');

var sendJSONresponse = function (res, status, content) {
    console.log(content);
    res.status(status);
    res.json(content);
};

var functions = {
    Updatetree: function (req, res) {
        var senderror = function(err){
            return res.status(403).send({msg: 'Something Wrong', error:err});
        }
        console.log(req.body.name);
        TreeCatalogue.findOneAndUpdate({name:req.body.name},{name:req.body.name, tree:req.body.tree},function (err,doc) {
            if(err) throw err;
            console.log('update success');
            sendJSONresponse(res,200,{success:true})
        });
    },
    Gettree: function(req, res){
        var senderror = function (err) {
            return res.status(403).send({msg: 'Something Wrong', error:err});
        }
        //console.log(req.body.name);
        TreeCatalogue.find({name:req.body.name}).exec(function(err,items){
            if(err) senderror(err);
            else  sendJSONresponse(res, 200, items);
        })
    },
    Addtree: function (req, res) {
        var newItem = TreeCatalogue({name:'user',tree:'{"name":"报告模板","children":[{"name":"全局模板","hidden":true,"children":[],"uuid":542421589142},{"name":"用户模板","hidden":true,"children":[{"name":"用户模板1","hidden":true,"children":[],"uuid":8683081556829},{"name":"用户模板2","hidden":true,"children":[],"uuid":5567155325468}],"uuid":1709889096213}],"uuid":8253482012122}'});
        newItem.save(function(err){
            if(err){
                sendJSONresponse(res,404,err);
            }else{
                sendJSONresponse(res,200,{success:true});
            }
        });
    },
    Gettemplate: function (req, res) {
        // console.log(req);
        var senderror = function (err) {
            return res.status(403).send({msg: 'Something Wrong', error: err});
        };
        console.log(req.body.name);
        ReportTemplate.find({'uuid': req.body.uuid}).exec(function (err, items) {
            if (err) senderror(err);
            else sendJSONresponse(res, 200, items);
        })
    },
    Addtemplate:function( req, res){
        console.log(req.body);
        var senderror = function (err) {
            return res.status(403).send({msg: 'Something Wrong', error: err});
        };
        if(!req.body.uuid){
            console.log(req.body);
            res.json({success:false, msg: 'you must enter a report uuid'});
        }else{
            console.log(req.body);
            var newItem = ReportTemplate(req.body);
            newItem.save(function(err){
                if(err){
                    sendJSONresponse(res,404,err);
                }else{
                    sendJSONresponse(res,200,{success:true});
                }
            });
        }
    },
    Updatetemplate:function(req,res){
        console.log("update"+req.body);
        var senderror = function (err) {
            return res.status(403).send({msg: 'Something Wrong', error: err});
        };
        if(!req.body.uuid){
            res.json({success:false, msg: 'you must enter a report uuid'});
        }
        else{
            console.log(req.body);
            ReportTemplate.findOneAndUpdate({uuid:req.body.uuid},
                {uuid:req.body.report.uuid,name:req.body.report.name,report:req.body.report.report,declares:req.body.report.declares}
                ,function (err,doc) {
                    if(err) throw err;
                    console.log('update success');
                    sendJSONresponse(res, 200, {success:true})
                })
        }

    }
}

module.exports = functions;