/**
 * Created by th3ee on 7/30/17.
 */
var User = require('../model/user');
var Item = require('../model/item');
var Hero = require('../model/hero');
var Report = require('../model/report');
var ReportRecord = require('../model/reportRecord');
var Group = require('../model/group');
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
    getLocalItem: function (req, res) {
        Item.find({'$and':[{'sendHospital': req.body.hospital},{'destination': '--'}]}).exec(function (err, items) {
            if (err) {
                senderror(err);
            }
            else {
                sendJSONresponse(res, 200 ,items);
            }
        })
    },

    getSendingItem: function (req, res) {
        Item.find({'$and':[{'sendHospital': req.body.hospital},{'destination': {'$nin': ['--']}}]}).exec(function (err, items) {
            if (err) {
                senderror(err);
            }
            else {
                sendJSONresponse(res, 200 ,items);
            }
        })
    },

    getApplication: function (req, res) {
        Item.find({'$and':[{'destination': req.body.hospital}, {'transferstatus': '等待接收'}]}).exec(function (err, items) {
            if (err) {
                senderror(err);
            }
            else {
                sendJSONresponse(res, 200 ,items);
            }
        })
    },

    sendApplication: function (req,res) {
        Item.findOneAndUpdate({'examID': req.body.examID}, {
            'destination': req.body.destination,
            'transferstatus': '等待接收',
            'applyDoc': req.body.doctor,
            'transReason': req.body.reason
        }, function (err) {
            if (err) {
                senderror(err);
            } else {
                sendJSONresponse(res, 200, {msg: 'send success'});
            }
        })
    },

    getOtherItem: function (req, res) {
        Item.find({'$and':[{'destination': req.body.hospital},{'transferstatus': '已接收'}]}).exec(function (err, items) {
            if (err) {
                senderror(err);
            }
            else {
                sendJSONresponse(res, 200 ,items);
            }
        })
    },

    acceptApplication: function (req, res) {
        Item.findOneAndUpdate({'examID': req.body.examID}, {'transferstatus': '已接收'}, function (err) {
            if (err) {
                senderror(err);
            } else {
                sendJSONresponse(res, 200, { msg : 'accept success'});
            }
        })
    },

    rejectApplication: function (req, res) {
        Item.findOneAndUpdate({'examID': req.body.examID}, {'transferstatus': '已拒绝', 'rejection': req.body.rejection}, function (err) {
            if (err) {
                senderror(err);
            } else {
                sendJSONresponse(res, 200, { msg : 'reject success'});
            }
        })
    },

    AcceptRejection: function (req, res) {
        Item.findOneAndUpdate({'examID': req.body.examID}, {
            'transferstatus': '--',
            'rejection': '--',
            'destination': '--',
            'applyDoc': '--',
            'transReason': '--'
        }, function (err) {
            if (err) {
                senderror(err);
            } else {
                sendJSONresponse(res, 200, { msg : 'accept rejection'});
            }
        })
    },

    PickItem: function (req, res) {
        Item.findOneAndUpdate({'examID': req.body.examID}, {
            'owner': req.body.doctor
        }, function (err) {
            if (err) {
                senderror(err);
            } else {
                sendJSONresponse(res, 200, { msg: 'You have picked the item'});
            }
        })
    },

    GetOwner: function (req, res) {
        Item.findOne({'examID': req.body.examID}).exec(function (err, item) {
            if (err) {
                senderror(err);
            } else {
                if (item)
                sendJSONresponse(res, 200, item.owner);
                else
                    sendJSONresponse(res, 200, {status: 'this item get picked by nobody!'});
            }
        })
    },

    GetOwnItems: function (req, res) {
        Item.find({'$and': [
            {'owner': req.body.doctor},
            {'$or': [
            {'$and':[{'sendHospital': req.body.hospital},{'destination': '--'}]},
            {'$and':[{'destination': req.body.hospital},{'transferstatus': '已接收'}]}
            ]}
            ]}
            ).exec(function (err, items) {
            if (err) {
                senderror(err);
            } else {
                sendJSONresponse(res, 200, items)
            }
        })
    },

    SavePic: function (req, res) {
        if(!req.body.examID){
            console.log(req.body);
            res.json({success: false, msg: 'You must have a examID'});
        }
        else{
            console.log(req.body);
            var newItem = ReportPic(req.body);
            newItem.save(function (err) {
                if(err){
                    sendJSONresponse(res,404,err);
                }
                else{
                    sendJSONresponse(res,200,{success: true});
                }
            })
        }
    },

    GetPic: function (req, res) {
        ReportPic.find({'examID': req.body.examID}
        ).exec(function (err, items) {
            if (err) {
                senderror(err);
            } else {
                sendJSONresponse(res, 200, items)
            }
        })
    },
};

module.exports = functions;