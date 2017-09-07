// var email   = require('emailjs/email');
var Message = require('../model/message');
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
    console.log(content);
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
                            reportAct: user.reportAct, usertype: user.usertype, hospital: user.hospital});
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
                reportAct: [],
                hospital: req.body.hospital,
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

    RefreshUser: function (req, res) {
        var NewUsers = [
            {'name': '王泽','password': '12345', 'gender': '男', 'age': '20', 'department': '医学影像科', 'status': '有效', 'level': [], 'phone': '18772765784','address': '--','usertype': 'specialist', 'hospital': '交大一附院', 'reportAct': []},
            {'name': '王顺','password': '12345', 'gender': '男', 'age': '35', 'department': '医学影像科', 'status': '有效', 'level': [], 'phone': '18872777761','address': '--','usertype': 'specialist', 'hospital': '交大一附院', 'reportAct': []},
            {'name': '孟宪','password': '12345', 'gender': '男', 'age': '45', 'department': '医学影像科', 'status': '有效', 'level': [], 'phone': '13992856291','address': '--','usertype': 'specialist', 'hospital': '交大一附院', 'reportAct': []},
            {'name': '周武','password': '12345', 'gender': '男', 'age': '20', 'department': '医学影像科', 'status': '有效', 'level': [], 'phone': '14785633645','address': '--','usertype': 'specialist', 'hospital': '西京医院', 'reportAct': []},
            {'name': '李涛','password': '12345', 'gender': '男', 'age': '35', 'department': '医学影像科', 'status': '有效', 'level': [], 'phone': '13678468376','address': '--','usertype': 'specialist', 'hospital': '西京医院', 'reportAct': []},
            {'name': '张华','password': '12345', 'gender': '男', 'age': '45', 'department': '医学影像科', 'status': '有效', 'level': [], 'phone': '18897965476','address': '--','usertype': 'specialist', 'hospital': '西京医院', 'reportAct': []}
        ];
        NewUsers.forEach(function (d) {
            var user = User(d);
            user.save(function (err) {
                if(err){
                    console.log('save failed');
                } else {
                    console.log('successfully saved');
                }
            })
        });
        sendJSONresponse(res, 200, {update_success: true})

    },

    RemoveAllDoctors: function (req, res) {
        User.remove({'usertype': 'specialist'}).exec(function (err) {
            if(err) res.json({success: false});
            else res.json({success: true});
                })
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
            transferstatus: '--',
            destination: '--',
            applyDoc: '--',
            time: req.body.time,
            applytime: req.body.applytime,
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

        var Allpromise = [];
        var GroupPromise = [];

        if(!req.body.name){
            console.log(req.body);
            res.json({success: false, msg: 'You must enter a user name'});
        }
        else {
            console.log(req.body.name);
            req.body.name.forEach(function (d) {
                console.log(req.body.name);
               var promise = User.findOne({'name':d.name}).exec(function (err, user) {
                   console.log(user);
                   var actions = [];
                   var reportAct = [];
                    var repeat = false;
                    user.level.forEach(function (t) {
                        if (t === req.body.level) {
                            repeat = true;
                        }
                    });
                    if (!repeat)
                    {
                        user.level.push(req.body.level);
                    }
                    console.log(user.level);
                    user.level.forEach(function (d) {
                        var promise =  Group.findOne({'name': d}).exec(function (err, group) {
                            if(err) throw err;
                            else console.log('found group');
                            actions = actions.concat(group.reportAct);
                            console.log('this is' + group.reportAct);
                        });
                        GroupPromise.push(promise);
                    });
                    Promise.all(GroupPromise).then(function () {
                        console.log(actions);
                        console.log('this is useract'+ user.level);
                        for (var i =0;i < actions.length;i++){
                            var repeat = false;
                            reportAct.forEach(function (d) {
                                    if (d === actions[i]){
                                        repeat = true;
                                    }
                                }
                            );
                            if (!repeat) {
                                reportAct.push(actions[i]);
                            }
                        }
                        var UserUpdate = {'level': user.level, 'reportAct': reportAct};
                        User.findOneAndUpdate({'name': d.name}, UserUpdate, function (err) {
                            if (err) throw err;
                            else console.log('updated');
                        });
                    });
                });
                Allpromise.push(promise)
            });
        }
        Promise.all(Allpromise).then(function () {
            sendJSONresponse(res, 200, {update: 'success'});
        })
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
    },

    removeGroup: function(req,res){
        Group.remove().exec(function(err){
            if (err) {
                throw err;
            }
            sendJSONresponse(res,200,{remove_success: true});
        })
    },

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

    deleteRecordById: function (req,res) {
        ReportRecord.remove({'examID': req.body.examID}).exec(function (err, doc){
            if(err){
                console.log(err);
                return;
            }
            sendJSONresponse(res,200,doc);
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
        Report.findOneAndUpdate({'examID':req.body.examID}, {
            'description': req.body.description,
            'diagnosis': req.body.diagnosis,
            'status': req.body.status,
            'initial': false,
            'reportDoc': req.body.reportDoc
        }, function (err,doc) {
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
    },

    sendMessage: function(req, res){
        console.log('sendMessage!');
        var newMessage = Message(req.body);
        newMessage.state = false;
        console.log(newMessage);
        newMessage.save(function(err){
            if(err){
                sendJSONresponse(res,404,err);
            }
            else{
                sendJSONresponse(res,200,{success: true});
            }
    })
    },

    getAllMessage: function (req, res) {
        console.log('getAllmessage');
        console.log(req.body);
        Message.find({'to':req.body.to}).exec(function (err , messages){
            console.log(messages);
            if(err){
                console.log(err);
                return;
            }
            sendJSONresponse(res,200,messages);
        });
    },
    getNewMessage: function(req,res){
        Message.find({'to':req.body.to,'state':false}).exec(function (err , msg){
            if(err){
                console.log(err);
                return;
            }

            sendJSONresponse(res,200,msg);
        });
    },
    updateMessage: function (req,res) {
        console.log('updateMessage');
        console.log(req.body);
        Message.findOneAndUpdate({'_id':req.body._id}, {'state': req.body.state}, function (err,doc) {
            if (err) throw err;
            sendJSONresponse(res,200,{success:true})
        })
    },

    deleteMessage: function (req,res) {
        console.log('remove'+req.body);
        Message.findOneAndRemove({'_id':req.body._id},function (err, items){
            if(err){
                console.log(err);
                return;
            }
            sendJSONresponse(res,200,items);
        })
    },

};

module.exports = functions;
