// var mongoose = require('mongoose');
var friendShip = require('../model/friendShip');

var sendJSONresponse = function (res, status, content) {
    console.log(content);
    res.status(status);
    res.json(content);
};

var functions = {
    getFriendShip(req,res){
        console.log(req.body);
        friendShip.find({'name':req.body.name }).exec(function (err, items){
            if(err){
                console.log(err);
                return;
            }
            console.log(items);
            sendJSONresponse(res,200,items);
        })
    },

    refreshFriendShip:function(req,res){
        var friendship = [
            {'name':'尤竹荣','friends':['王朋'],'request':['王泽'],'accept':[]},
            {'name':'王朋','friends':['尤竹荣','王泽'],'request':[],'accept':[]},
            {'name':'王泽','friends':['王朋',],'request':['孟宪'],'accept':[]},
            {'name':'孟宪','friends':[],'request':[],'accept':['王泽']},
            {'name':'王顺','friends':[],'request':[],'accept':[]}
        ];
        friendship.forEach(function (d) {
            var fship = friendShip(d);
            fship.save(function (err) {
                if(err){
                    console.log('save failed');
                } else {
                    console.log('successfully saved');
                }
            })
        });
        // sendJSONresponse(res, 200, {update: 'success'});
    },

    requestFriend(req,res){
        friendShip.findOne({'name': req.body.name}).exec(function (err,fship) {
            if(err){
                console.log(err);
                return;
            }
            console.log(fship);
            fship.request.push(req.body.request);
            friendShip.findOneAndUpdate({'name': req.body.name},fship,function (err) {
                if (err) throw err;
                else console.log('updated');
            });
            sendJSONresponse(res, 200, fship);
        });
        friendShip.findOne({'name':req.body.request}).exec(function(err,fship){
            if(err){
                console.log(err);
                return;
            }
            console.log(fship);
            fship.accept.push(req.body.name);
            friendShip.findOneAndUpdate({'name': req.body.request},fship,function (err) {
                if (err) throw err;
                else console.log('updated');
            });
        });

    },

    acceptFriend(req,res){
        friendShip.findOne({'name': req.body.name}).exec(function (err,fship) {
            if(err){
                console.log(err);
                return;
            }
            fship.accept.remove(req.body.accept);
            fship.friends.push(req.body.accept);
            friendShip.findOneAndUpdate({'name': req.body.name},fship,function (err) {
                if (err) throw err;
                else console.log('updated');
            });
            sendJSONresponse(res, 200, fship);
        });
        friendShip.findOne({'name':req.body.accept}).exec(function(err,fship){
            if(err){
                console.log(err);
                return;
            }
            fship.friends.push(req.body.name);
            fship.request.remove(req.body.name);
            friendShip.findOneAndUpdate({'name': req.body.accept},fship,function (err) {
                if (err) throw err;
                else console.log('updated');
            });
        });
    },

    deleteFriend(req,res){
        console.log(req.body);
        friendShip.findOne({'name':req.body.name}).exec(function(err,fship){
            if(err){
                console.log(err);
                return;
            }
            console.log(fship.friends);
            console.log(req.body.delete);
            fship.friends.remove(req.body.delete);
            friendShip.findOneAndUpdate({'name': req.body.name},fship,function (err) {
                if (err) throw err;
                else console.log('updated');
            });
            sendJSONresponse(res, 200, fship);
        })
    }
};

module.exports = functions;