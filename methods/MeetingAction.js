/**
 * Created by th3ee on 8/29/17.
 */
/**
 * Created by th3ee on 7/30/17.
 */

var Meet = require('../model/meetItem');
var ScriptReport = require('../model/scriptReport');
var Report = require('../model/report');
var NewReport = require('../model/newReport');
var Item = require('../model/item');
var Temp = require('../model/saveTemp');
var ReportRecord = require('../model/reportRecord');
var mongoose = require('mongoose');
var config = require('../config/database');
var jwt = require('jwt-simple');
var nodemailer = require('nodemailer');
var ejs = require('ejs');

var getTime = function () {
    // 格式化日期，获取今天的日期
    var dates = new Date();
    var year = dates.getFullYear();
    var month = ( dates.getMonth() + 1 ) < 10 ? '0' + ( dates.getMonth() + 1 ) : ( dates.getMonth() + 1 );
    var day = dates.getDate() < 10 ? '0' + dates.getDate() : dates.getDate();
    var time = year + '-' + month + '-' + day;
    return time;
};

var sendJSONresponse = function (res, status, content) {
    res.status(status);
    res.json(content);
};

var senderror = function (err) {
    return res.status(403).send({msg: 'Something Wrong', error: err});
};

var functions = {

    ItemCanMeet: function (req, res) {
        Item.find({'$and':[{'responsible': req.body.doctor}, {'$or':[{'status': '待书写'},{'status': '诊断中'}]}]}).exec(function (err, items) {
            if (err) senderror(err);
            else sendJSONresponse(res, 200, items);
        })
    },

    addMeetItem: function (req, res) {
        var meetingDate = req.body.date.replace(/-/g, '');
        var meetingID = meetingDate + Math.random().toString(6).substr(2).slice(2,6);
        if(!req.body.examID){
            console.log(req.body);
            res.json({success: false, msg: 'There must be an examID'});
        } else {
            console.log(meetingID);
            var newItem = Meet({
                examID: req.body.examID,
                meetID: meetingID,
                title: req.body.title,
                date: req.body.date,
                owner: req.body.owner,
                cooperator: req.body.cooperator,
                status: '进行中',
                reason: req.body.reason
            });
            newItem.save(function (err) {
                if(err) {
                    sendJSONresponse(res, 404, err);
                } else {
                    sendJSONresponse(res, 200, {success: true});
                }
            });
            var participant = [];
            participant.push(req.body.owner);
            req.body.cooperator.forEach(function (d) {
                participant.push(d);
            });
            participant.forEach(function (p) {
                var isMajor = p === req.body.owner;
                Temp.findOne({'hospital': req.body.hospital}).exec(function (err, temp) {
                    var newItem = ScriptReport({
                        examID: req.body.examID,
                        meetID: meetingID,
                        format: temp.format,
                        completedBy: p,
                        major: isMajor
                    });
                    newItem.save(function (err) {
                        if(err) {
                            senderror(err);
                        } else {
                            //  sendJSONresponse(res, 200, {success: true});
                            console.log('save script success');
                        }
                    });
                })
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

    getMeetByID: function (req, res) {
        Meet.findOne({'meetID': req.body.meetID}).exec(function (err, meeting) {
            if (err) {
                senderror(err);
            } else {
                sendJSONresponse(res, 200, meeting);
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
   /* createScript: function (req, res) {
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
                            senderror(err);
                        } else {
                            sendJSONresponse(res, 200, {success: true});
                        }
                    });
                }
            })
          }
        },*/

    getScript: function (req, res) {
        ScriptReport.find({'meetID': req.body.meetID}).exec(function (err, scripts) {
            if (err) {
                senderror(err);
            } else {
                sendJSONresponse(res, 200, scripts);
            }
        })
    },
    getAllScript: function (req, res) {
        ScriptReport.find().exec(function (err, scripts) {
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
            'format': req.body.format
        }, function (err, script) {
            if (err) throw err;
            else if(script)
            sendJSONresponse(res, 200, {update_success: true});
            else sendJSONresponse(res, 200, {update_failed: 'No matched script found'});
        })
    },

    SaveScreenShot: function (req, res) {
        console.log(req.body);
        console.log(req.body.screenShot);
        Item.findOneAndUpdate({'examID': req.body.examID}, {'screenShot': req.body.screenShot}, function (err, item) {
            if (err) {
                senderror(err);
            } else sendJSONresponse(res, 200, {Screenshots_saved: true});
        })
    },

    submitScript: function (req, res) {
       ScriptReport.findOne({'$and': [{'meetID': req.body.meetID},{'major': true}]}).exec(function (err, script) {
           console.log(script);
           /*var reportUpdate = {
               'diagnosis': script.diagnosis,
               'description': script.description,
               'reportDoc': script.completedBy,
               'verifyDoc': '暂无',
               'status': '诊断中',
               'reporttime': getTime(),
               'initial': false
           };*/
           var record = ReportRecord({
               'examID': req.body.examID,
               'operate_type': '生成报告',
               'name': script.completedBy,
               'date': getTime()
           });

           NewReport.findOneAndUpdate({'examID': req.body.examID}, {
               'format': script.format,
               'reportDoc': script.completedBy,
               'verifyDoc': '暂无',
               'initial': false
           }, function (err) {
               if (err) senderror(err);
               console.log('update_report')
           });
           record.save(function (err) {
               if (err) senderror(err);
               console.log('record_generated');
           })
       });

       Meet.findOneAndUpdate({'meetID': req.body.meetID}, {'status': '已关闭'}, function (err, meet) {
           if (err) {
               senderror(err);
           } else {
               console.log(meet);
               console.log('update meet success');
           }
       });

       Item.findOneAndUpdate({'examID': req.body.examID}, {'status': '诊断中' , 'applystatus': '诊断中'}, function (err) {
           if (err)
               senderror(err);
           else {
               console.log('update item');
           }
       });
        sendJSONresponse(res, 200, {reportUpdated: true});
    }




};

module.exports = functions;