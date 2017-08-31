/**
 * Created by th3ee on 8/29/17.
 */
/**
 * Created by th3ee on 7/30/17.
 */

var Meet = require('../model/meetItem');
var ScriptReport = require('../model/scriptReport');
var Report = require('../model/report');
var Item = require('../model/item');
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
        Item.find({'$and':[{'owner': req.body.doctor}, {'$or':[{'status': '待书写'},{'status': '诊断中'}]}]}).exec(function (err, items) {
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
                var newItem = ScriptReport({
                    examID: req.body.examID,
                    meetID: meetingID,
                    description: '暂无',
                    diagnosis: '暂无',
                    picID: '暂无',
                    completedBy: p,
                    time: req.body.date,
                    major: isMajor
                });
                newItem.save(function (err) {
                    if(err) {
                        senderror(err);
                    } else {
                      //  sendJSONresponse(res, 200, {success: true});
                        console.log('save success');
                    }
                });
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
    },

    submitScript: function (req, res) {
        var report = new Report;
       Item.findOne({'examID': req.body.examID}).exec(function (err, item) {
           if (err) {
               console.log(item);
               senderror(err)
           } else {
               console.log(item);
               report.patientID = item.patientID;
               report.examID = item.examID;
               report.name = item.name;
               report.age = item.age;
               report.gender = item.gender;
               report.examContent = item.examContent;
               report.examPart = item.examPart;
               report.date = item.time;
               report.verifyDoc = '暂无';
               console.log('item found');

               ScriptReport.findOne({'$and':[{'meetID': req.body.meetID},{'major': true}]}).exec(function (err, script) {
                   if (err) {
                       senderror(err)
                   } else {
                       report.status = '待审核';
                       report.description = script.description;
                       report.diagnosis = script.diagnosis;
                       report.reportDoc = script.owner;
                       report.reporttime = script.time;
                       console.log('meet found');
                   }
               });
               report.save(function (err) {
                   if (err) {
                       senderror(err)
                   } else {
                       console.log('report save success');
                   }
               });
           }
       });

       console.log(report);

       ScriptReport.findOneAndUpdate({'meetID': req.body.meetID}, {'status': '已关闭'}, function (err) {
           if (err) {
               senderror(err);
           } else {
               console.log('update meet success');
           }
       });
       var newRecord = ReportRecord({
           'examID': report.examID,
           'operate_type': '生成报告',
           'name': report.reportDoc,
           'date': getTime()
       });
       newRecord.save(function (err) {
           if(err) {
               senderror(err);
           } else {
               console.log('update item');
           }
       });
       Item.findOneAndUpdate({'examID': report.examID}, {'status': '诊断中' , 'applystatus': '诊断中'}, function (err) {
           if (err)
               senderror(err);
           else {
               sendJSONresponse(res,200,{update_item: true});
           }
       });
    }




};

module.exports = functions;