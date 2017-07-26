// var email   = require('emailjs/email');
var User = require('../model/user');
var Item = require('../model/item');
var Hero = require('../model/hero');
var Report = require('../model/report');
var ReportRecord = require('../model/reportRecord');
var Group = require('../model/group');
var mongoose = require('mongoose');
var config = require('../config/database');
var jwt = require('jwt-simple');
var nodemailer = require('nodemailer');
var ejs = require('ejs');


var sendJSONresponse = function (res, status, content) {
    res.status(status);
    res.json(content);
};

var functions = {

    authenticate: function(req, res) {
        console.log(req.body);
        User.findOne({'$and':[
            {name: req.body.email},
            {status: '有效'}
        ]
        }, function(err, user){
            if (err) throw err;

            if(!user) {
                res.status(403).send({success: false, msg: 'Authentication failed, User not found'});
            }

           else {
                console.log('found simple user');
                console.log(user);
                user.comparePassword(req.body.password, function(err, isMatch){
                    if(isMatch && !err) {
                        var token = jwt.encode(user, config.secret);
                        res.json({username:user.name, success: true, token: token, userlevel: user.level,
                        reportAct: user.reportAct});
                    } else {
                        return res.status(403).send({username:user.name, success: false, msg: 'Authenticaton failed, wrong password.'});
                    }
                })
            }

        })
    },
    authenticateNew: function(req, res) {
        console.log(req.body);
        console.log(req.body.values.email);
        console.log(req.body.values.password);
        User.findOne({'$and':[
            {name: req.body.values.email},
             {'usertype': req.body.usertype},
            {'status': '有效'}
        ]}, function(err, user){
            if (err) throw err;

            if(!user) {
                res.status(403).send({success: false, msg: 'Authentication failed, User not found'});
            }

            else {
                console.log('found user');
                console.log(user);
                user.comparePassword(req.body.values.password, function(err, isMatch){
                    if(isMatch && !err) {
                        var token = jwt.encode(user, config.secret);
                        res.json({username:user.name, success: true, token: token, userlevel: user.level,
                            reportAct: user.reportAct, usertype: user.usertype});
                    } else {
                        console.log(err);
                        return res.status(403).send({username:user.name, success: false, msg: 'Authenticaton failed, wrong password.'});
                    }
                })
            }

        })
    },
    addNew: function(req, res){
        if((!req.body.name) || (!req.body.password) || (!req.body.level)){
            console.log(req.body.name);
            console.log(req.body.password);

            res.json({success: false, msg: 'Enter all values'});
        }
        else {
            var newUser = User({
                name: req.body.name,
                gender: req.body.gender,
                age: req.body.age,
                password: req.body.password,
                department: req.body.department,
                status: req.body.status,
                level: req.body.level,
                phone: req.body.phone,
                address: req.body.address,
                usertype: req.body.usertype,
                reportAct: []
            });

            newUser.save(function(err, newUser){
                if (err){
                    res.json({success:false, msg:'Failed to save'})
                }

                else {
                    res.json({success:true, msg:'Successfully saved'});
                }
            })
        }
    },
    getinfo: function(req, res){
        if(req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
            var token = req.headers.authorization.split(' ')[1];
            var decodedtoken = jwt.decode(token, config.secret);
            return res.json({success: true, msg: 'hello '+decodedtoken.name});
        }
        else {
            return res.json({success:false, msg: 'No header'});
        }
    },
    getUsers: function(req, res){
        User.find().exec(function (err, users){
            if(err){
                console.log(err);
                return;
            }
            sendJSONresponse(res,200,users);
        });
    },
    getDoctors: function(req, res){
        User.find({'usertype': 'specialist'}).exec(function (err, users){
            if(err){
                console.log(err);
                return;
            }
            sendJSONresponse(res,200,users);
        });
    },
    getUserByName: function(req, res){
        User.findOne({'name': req.body.name}).exec(function (err, user){
            if(err){
                console.log(err);
                return;
            }
            sendJSONresponse(res,200,user);
        });
    },
    deleteUser: function (req,res) {
        var query = {'name': req.body.name};
        User.findOneAndRemove(query,function(err,doc){
            if (err) throw err;
            console.log('delete success');
            sendJSONresponse(res,200,{success: true})
        })
    },
    addHero: function(req,res){
        if(!req.body.name){
            res.json({success: false, msg: 'You must enter a patient name'});
        }
        else{
            var newHero = Hero({
            patientID: req.body.patientID,
            examID: req.body.examID,
            name: req.body.name,
            gender: req.body.gender,
            age: req.body.age,
            reason: req.body.reason,
            od: req.body.originaldiagnosis,
            status: req.body.status,
            time: req.body.time,
            applytime: req.body.applytime,
            user: req.body.user,
            examContent: req.body.examContent,
            examPart: req.body.examPart
        });
            newHero.save(function (err) {
                if(err){
                    sendJSONresponse(res,404,err);
                }
                else{
                    module = newHero.module;
                    sendJSONresponse(res,200,{success: module});
                }
            })
        }
    },

    addReport: function(req,res){
        if(!req.body.name){
            console.log(req.body);
            res.json({success: false, msg: 'You must enter a patient name'});
        }
        else{
            console.log(req.body);
            var newReport = Report(req.body);
            newReport.save(function (err) {
                if(err){
                    sendJSONresponse(res,404,err);
                }
                else{
                    module = newReport.module;
                    sendJSONresponse(res,200,{success: module});
                }
            })
        }
    },

    addItem: function(req,res){
        if(!req.body.name){
            console.log(req.body);
            res.json({success: false, msg: 'You must enter a patient name'});
        }
        else{
            console.log(req.body);
            var newItem = Item(req.body);
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

    addGroup: function(req,res){
        if(!req.body.name){
            console.log(req.body);
            res.json({success: false, msg: 'You must enter a patient name'});
        }
        else{
            console.log(req.body);
            var newGroup = Group(req.body);
            newGroup.save(function (err) {
                if(err){
                    sendJSONresponse(res,404,err);
                }
                else{
                    sendJSONresponse(res,200,{success: true});
                }
            })
        }
    },

    updateGroup: function(req,res){
        if(!req.body.name){
            console.log(req.body);
            res.json({success: false, msg: 'You must enter a patient name'});
        }
        else {
            console.log(req.body);
            Group.findOneAndUpdate({'name': req.body.name}, {'members': req.body.members,
                'reportAct': req.body.reportAct},
            function(err){
                if (err) throw err;
                sendJSONresponse(res,200,{success: true});
            })
        }
    },

    updateUser: function(req,res){
        if(!req.body.name){
            console.log(req.body);
            res.json({success: false, msg: 'You must enter a user name'});
        }
        else {
            console.log(req.body.name);
            req.body.name.forEach(function (user) {
                User.findOneAndUpdate({
                    'name': user.name
                },{
                    'level': req.body.level,
                    'reportAct': req.body.reportAct
                },function (err) {
                    if (err) return;
                })
            });
        }
    },

    deleteGroup: function(req,res){
        if(!req.body.name){
            console.log(req.body);
            res.json({success: false, msg: 'You must enter a patient name'});
        }
        else {
            console.log(req.body);
            Group.findOneAndRemove({'name': req.body.name}).exec(function(err){
                    if (err) throw err;
                    sendJSONresponse(res,200,{delete_success: true});
                })
        }

    },

    getGroup: function(req,res){
            Group.find().exec(function(err, groups){
                if (err) {
                    throw err;
                }
                sendJSONresponse(res,200,groups);
            })
        }
    ,

    getGroupByName: function(req,res){
        Group.find({'name': req.body.name}).exec(function(err, group){
            if (err) {
                throw err;
            }
            sendJSONresponse(res,200,group);
        })
    }
    ,

    addReportRecord: function(req,res){
        if(!req.body.name){
            res.json({success: false, msg: 'There must be someone and some action'})
        }
        else{
            var newItem = ReportRecord(req.body);
            newItem.save(function(err) {
                if(err){
                    sendJSONresponse(res,404,err);
                }
                else{
                    sendJSONresponse(res,200,{success: true});
                }
            })
        }
    },

    getRecord: function (req,res) {
        ReportRecord.find({'examID': req.body.examID}).exec(function (err, items){
            if(err){
                console.log(err);
                return;
            }
            sendJSONresponse(res,200,items);
        })
    },

    getAllRecord: function (req,res) {
        ReportRecord.find().exec(function (err, items){
            if(err){
                console.log(err);
                return;
            }
            sendJSONresponse(res,200,items);
        })
    },

    deleteAllRecord: function (req,res) {
        ReportRecord.remove().exec(function (err, items){
            if(err){
                console.log(err);
                return;
            }
            sendJSONresponse(res,200,items);
        })
    },

    getAllItem: function(req,res){
        var sendItems = [];
        if (req.body.type === 'report') {
        Item.find({'applystatus':{'$nin' : ['待申请']}}).exec(function (err , items){
            if(err){
                console.log(err);
                return;
            }
            items.forEach(function (d) {
                var item = {
                    patientID: d.patientID,
                    examID : d.examID,
                    name : d.name,
                    gender : d.gender,
                    age: d.age,
                    examContent: d.examContent,
                    examPart: d.examPart,
                    sendHospital: d.sendHospital,
                    reportDoc: d.reportDoc,
                    reporttime: d.reporttime,
                    time: d.time,
                    status: d.status,
                };
                sendItems.push(item);
            });
            sendJSONresponse(res,200,sendItems);
            console.log(sendItems);
        });
        } else if (req.body.type === 'apply') {

/*            var ApplyOperation = {
                '待申请': '申请阅片',
                '已申请': '查看申请',
                '诊断中': '查看申请',
                '诊断完毕': '查看申请'
            };*/
            Item.find().exec(function (err , items){
                if(err){
                    console.log(err);
                    return;
                }
                items.forEach(function (d) {
                    var item = {
                        patientID: d.patientID,
                        examID : d.examID,
                        name : d.name,
                        gender : d.gender,
                        age: d.age,
                        examContent: d.examContent,
                        examPart: d.examPart,
                        sendHospital: d.sendHospital,
                        reportDoc: d.reportDoc,
                        reporttime: d.reporttime,
                        time: d.time,
                        status: d.applystatus
                       // operation: ApplyOperation[d.applystatus]
                    };
                    sendItems.push(item);
                });
                sendJSONresponse(res,200,sendItems);
                console.log(sendItems);
               // sendJSONresponse(res,200,items);
        })
        } else if (req.body.type === 'organization') {
            Item.find().exec(function (err , items){
                if(err){
                    console.log(err);
                    return;
                }
                sendJSONresponse(res, 200, items)
        })
        }
    },

    getItemByPID: function(req,res){
        Item.findOne({'patientID': req.body.patientID}).exec(function (err , item){
            if(err){
                console.log(err);
                return;
            }
            sendJSONresponse(res,200,item);
        });
    },

    getItemByEID: function(req,res){
        Item.findOne({'examID': req.body.examID}).exec(function (err , item){
            if(err){
                console.log(err);
                return;
            }
            sendJSONresponse(res,200,item);
        });
    },

    deleteItem: function (req,res) {
        var query = {'examID': req.body.examID};
        Item.findOneAndRemove(query,function(err,doc){
            if (err) throw err;
            console.log('delete success');
        });
        ReportRecord.remove(query, function (err,doc) {
            if (err) throw err;
            sendJSONresponse(res, 200 , doc);
        })
    },

    getItemByName: function (req, res) {
        Item.find({'name': req.body.name}).exec(function (err , items){
            if(err){
                console.log(err);
                return;
            }
            sendJSONresponse(res,200,items);
        });
    },

    getItemByTime: function (req,res) {
        Item.find({'$and':
            [{'time':{'$lt':req.body.enddate}},{'time':{'$gt':req.body.startdate}}]}).exec(function (err , items){
            if(err){
                console.log(err);
                return;
            }
            sendJSONresponse(res,200,items);
        });
    },
    updateApplyItem: function (req,res) {
        console.log(req.body);
        var query = {'examID': req.body.examID};
        Item.findOneAndUpdate(query,{'applystatus': req.body.applystatus},function(err,doc){
            if (err) throw err;
            console.log('update success');
            sendJSONresponse(res,200,{success: true})
        })
    },

    updateReportItem: function (req,res) {
        console.log(req.body);
        var query = {'examID': req.body.examID};
        Item.findOneAndUpdate(query,{'status': req.body.status },function(err,doc){
            if (err) throw err;
            console.log('update success');
        });
        Report.findOneAndUpdate(query,{'status': req.body.status, 'verifyDoc': req.body.verifyDoc },function(err,doc){
            if (err) throw err;
            console.log('update success');
            sendJSONresponse(res,200,{success: true})
        })
    },

    getReport: function(req,res){
        Report.find({'examID': req.body.examID}).exec(function (err , report){
            if(err){
                console.log(err);
                return;
            }
            sendJSONresponse(res,200,report);
        });
    },


    getAllReport: function(req,res){
        Report.find().exec(function (err , reports){
            if(err){
                console.log(err);
                return;
            }
            sendJSONresponse(res,200,reports);
        });
    },

    updateReport: function (req,res) {
        console.log(req.body.id);
        Report.findOneAndUpdate({'examID':req.body.examID}, {'description': req.body.description,
            'diagnosis': req.body.diagnosis, 'status': req.body.status}, function (err,doc) {
            if (err) throw err;
            sendJSONresponse(res,200,{success:true})
        })
    },
    deleteReport: function (req,res) {
        console.log(req.body.examID);
        Report.findOneAndRemove({'examID':req.body.examID}, function (err,doc) {
            if (err) throw err;
            sendJSONresponse(res,200,{success:true})
        })
    },

    getHero: function (req,res) {
        Hero.find().exec(function (err , users){
            if(err){
                console.log(err);
                return;
            }
            sendJSONresponse(res,200,users);
        });
    },
    getHeroByTime: function (req,res) {
        Hero.find({'$and':
            [{'time':{'$lt':req.body.enddate}},{'time':{'$gt':req.body.startdate}}]}).exec(function (err , users){
            if(err){
                console.log(err);
                return;
            }
            sendJSONresponse(res,200,users);
        });
    },
    getHeroDetail: function (req,res) {
        Hero.find({'examID':req.body.examID}).exec(function (err , hero){
            if(err){
                console.log(err);
                return;
            }
            sendJSONresponse(res,200,hero);
        });
    },
    deleteHero: function (req,res) {
        var query = {'name': req.body.name};
        Hero.findOneAndRemove(query,function(err,doc){
           if (err) throw err;
           console.log('delete success');
           sendJSONresponse(res,200,{success: true})
        })
    }
    ,
    updateHero: function (req,res) {
        console.log(req.body);
        console.log(req.body.name);
        console.log(req.body.status);
     var query = {'name': req.body.name};
        Hero.findOneAndUpdate(query,{'status': req.body.status},function(err,doc){
            if (err) throw err;
            console.log('update success');
            sendJSONresponse(res,200,{success: true})
        })
    }
    ,
  sendMail: function(req, res) {
        console.log(req.body);
      //配置邮件
      var transporter = nodemailer.createTransport({
          host: "smtp.163.com",
          secureConnection: true,
          port:465,
          auth: {
              user: 'wsswk311@163.com',
              pass: 'csr311'
          }
      });

      var option = {
          from:"wsswk311@163.com",
          to:req.body.recipients
      };
      option.subject = req.body.subject;
      option.html=ejs.render('您收到一个阅片申请，<a href="http://59.110.52.133:8084">点击这里</a>查看详情' ,req.body);

      transporter.sendMail(option, function(error, response){
          if(error){
              console.log("fail: " + error);
              return res.json({success: false, msg: 'sending denied,please try again'})
          }else{
              console.log("success: " + response.message);
              res.json({success: true, msg: 'sent'});
          }
      });

  },

    getCount: function (req, res) {
        var ItemCount = [];
        Item.count({'status': '已审核'}).exec(function (err, count) {
            if (err) {
                return;
            }
            ItemCount.push({'已审核': count});
            console.log(count);
        });
        Item.count({'status': '待书写'}).exec(function (err, count) {
            if (err) {
                return;
            }
            ItemCount.push({'待书写': count});
            console.log(count);
        });
        Item.count({'status': '待审核'}).exec(function (err, count) {
            if (err) {
                return;
            }
            ItemCount.push({'待审核': count});
        });
        res.json({'ItemCount': ItemCount});
    }

};

module.exports = functions;
