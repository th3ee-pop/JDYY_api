/**
 * Created by th3ee on 8/29/17.
 */
/**
 * Created by th3ee on 7/30/17.
 */
var User = require('../model/user');
var Item = require('../model/item');
var Hero = require('../model/hero');
var Report = require('../model/report');
var ReportRecord = require('../model/reportRecord');
var Group = require('../model/group');
var Meet = require('../model/meetItem');
var ReportPic = require('../model/reportPic');
var mongoose = require('mongoose');
var config = require('../config/database');
var jwt = require('jwt-simple');
var nodemailer = require('nodemailer');
var ejs = require('ejs');


var sendJSONresponse = function (res, status, content) {
    res.status(status);
    res.json(content);
};

var senderror = function (err) {
    return res.status(403).send({msg: 'Something Wrong', error: err});
};

var functions = {

    addMeetItem: function (req, res) {
        if(!req.body.examID){
            console.log(req.body);
            res.json({success: false, msg: 'There must be an examID'});
        } else {
            var meetingDate = req.body.date.replace(/-/g, '');
            var meetingID = meetingDate + Math.random().toString(4).substr(2);
            console.log(meetingID);
            var newItem = Meet({
                examID: req.body.examID,
                meetID: meetingID,
                title: req.body.title,
                date: req.body.date,
                owner: req.body.owner,
                cooperator: req.body.cooperator,
                status: req.body.status,
                reason: req.body.reason
            });
            newItem.save(function (err) {
                if(err) {
                    sendJSONresponse(res, 404, err);
                } else {
                    sendJSONresponse(res, 200, {success: true});
                }
            })
        }
    },

    getAllMeetItem: function (req, res) {
        Meet.find().exec(function (err, meetings) {
            if (err) {
                senderror(err);
            } else {
                sendJSONresponse(res ,200, meetings);
            }
        });
    },

    getOwningItem: function (req, res) {
        Meet.find({'owner': req.body.owner}).exec(function (err, meetings) {
            if (err) {
                senderror(err);
            } else {
                sendJSONresponse(res, 200, meetings);
            }
        })
    },

    getCoItem: function (req, res) {
        Meet.find({'cooperator': req.body.cooperator}).exec(function (err, meetings) {
            if (err) {
                senderror(err);
            } else {
                sendJSONresponse(res, 200, meetings);
            }
        })
    },

    deleteMeetItem: function (req, res) {
        Meet.findOneAndRemove({'examID': req.body.examID}).exec(function (err) {
            if (err) {
                senderror(err);
            } else {
                sendJSONresponse(res, 200, {delete_success: true});
            }
        })
    }
};

module.exports = functions;