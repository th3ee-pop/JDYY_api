/**
 * Created by th3ee on 8/29/17.
 */
/**
 * Created by th3ee on 7/30/17.
 */

var Meet = require('../model/meetItem');
var ScriptReport = require('../model/scriptReport');
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
    },

    //The api below are all about the script report
    createScript: function (req, res) {
        if(!req.body.examID || !req.body.meetID){
            console.log(req.body);
            res.json({success: false, msg: 'There must be an examID or meetID'});
        } else {
            var isMajor = true;
            Meet.find({'meetID': req.body.meetID}).exec(function (err, meeting) {
                if (err) {
                    senderror(err);
                } else {
                    console.log(meeting[0].owner);
                    isMajor = meeting[0].owner === req.body.completedBy;
                    var newItem = ScriptReport({
                        examID: req.body.examID,
                        meetID: req.body.meetID,
                        description: req.body.description,
                        diagnosis: req.body.diagnosis,
                        picID: req.body.picID,
                        completedBy: req.body.completedBy,
                        time: req.body.time,
                        major: isMajor
                    });
                    newItem.save(function (err) {
                        if(err) {
                            sendJSONresponse(res, 404, err);
                        } else {
                            sendJSONresponse(res, 200, {success: true});
                        }
                    });
                }
            })
          }
        },

    getAllScript: function (req, res) {
        ScriptReport.find({'meetID': req.body.meetID}).exec(function (err, scripts) {
            if (err) {
                senderror(err);
            } else {
                sendJSONresponse(res, 200, scripts);
            }
        })
    },

    deleteScript: function (req, res) {
        ScriptReport.findOneAndRemove({'meetID': req.body.meetID}).exec(function (err) {
            if (err) {
                senderror(err);
            } else {
                sendJSONresponse(res, 200, {delete_success: true});
            }
        })
    },

    updateScript: function (req, res) {
        ScriptReport.findOneAndUpdate({'$and':[{'meetID': req.body.meetID},{'completedBy': req.body.completedBy}]}, {
            'description': req.body.description,
            'diagnosis': req.body.diagnosis,
            'picID': req.body.picID
        }, function (err) {
            if (err) throw err;
            else
            sendJSONresponse(res, 200, {update_success: true});
        })
    }




};

module.exports = functions;