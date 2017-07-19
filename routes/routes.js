var express = require('express');
var actions = require('../methods/actions');

var router = express.Router();

router.post('/additem', actions.addItem);
router.post('/getitembyPid', actions.getItemByPID);
router.post('/getitembyEid', actions.getItemByEID);
router.post('/updateapplyitem', actions.updateApplyItem);
router.post('/updatereportitem', actions.updateReportItem);
router.post('/deleteitem', actions.deleteItem);
router.post('/getallitems', actions.getAllItem);
router.post('/getitembyName', actions.getItemByName);

router.post('/getherobytime', actions.getHeroByTime);
router.post('/getitembytime', actions.getItemByTime);
router.post('/authenticate', actions.authenticate);
router.post('/authenticateNew', actions.authenticateNew);
router.post('/adduser', actions.addNew);
router.post('/updateuser', actions.updateUser);
router.post('/deleteuser', actions.deleteUser);
router.post('/addhero', actions.addHero);
router.get('/getinfo', actions.getinfo);
router.get('/gethero', actions.getHero);
router.get('/getusers', actions.getUsers);
router.post('/getuser_by_name', actions.getUserByName);
router.post('/getherodetail', actions.getHeroDetail);
router.post('/updatehero', actions.updateHero);
router.post('/deletehero', actions.deleteHero);
router.post('/sendmail', actions.sendMail);

router.get('/getdoctors', actions.getDoctors);

router.post('/addreport', actions.addReport);
router.post('/getreport', actions.getReport);
router.get('/getallreport', actions.getAllReport);
router.post('/updatereport', actions.updateReport);
router.post('/deletereport', actions.deleteReport);

router.post('/addreportrecord', actions.addReportRecord);
router.post('/getrecord', actions.getRecord);
router.get('/getallrecord', actions.getAllRecord);
router.get('/deleteallrecord', actions.deleteAllRecord);

router.post('/add_group', actions.addGroup);
router.post('/update_group', actions.updateGroup);
router.post('/delete_group', actions.deleteGroup);
router.get('/get_group', actions.getGroup);
router.post('/get_group_by_name', actions.getGroupByName);

router.get('/get_status_count', actions.getCount);

module.exports = router;
