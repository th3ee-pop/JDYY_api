var express = require('express');
var actions = require('../methods/actions');
var Newactions = require('../methods/NewActions');
var MeetActions = require('../methods/MeetingAction');

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
router.post('/delete_record_ID', actions.deleteRecordById);

router.post('/add_group', actions.addGroup);
router.post('/update_group', actions.updateGroup);
router.post('/delete_group', actions.deleteGroup);
router.get('/get_group', actions.getGroup);
router.post('/get_group_by_name', actions.getGroupByName);

router.get('/get_status_count', actions.getCount);


router.post('/get_local_items', Newactions.getLocalItem);
router.post('/get_applied_items', Newactions.getApplyedItem);
router.post('/get_sending_items', Newactions.getSendingItem);
router.post('/get_applications', Newactions.getApplication);
router.post('/send_application', Newactions.sendApplication);
router.post('/get_other_items', Newactions.getOtherItem);
router.post('/accept_item', Newactions.acceptApplication);
router.post('/reject_item', Newactions.rejectApplication);
router.post('/accept_rejection', Newactions.AcceptRejection);
router.post('/pick_item', Newactions.PickItem);
router.post('/distribute_item', Newactions.DistributeItem);
router.post('/get_picked_items', Newactions.GetOwnItems);
router.post('/get_owner', Newactions.GetOwner);
router.post('/get_meeting_items', MeetActions.ItemCanMeet);
router.post('/save_screenshots', MeetActions.SaveScreenShot);

router.post('/save_pic', Newactions.SavePic);
router.post('/get_pic', Newactions.GetPic);

router.post('/meet_add', MeetActions.addMeetItem);
router.post('/get_own_meet', MeetActions.getOwningItem);
router.post('/get_co_meet', MeetActions.getCoItem);
router.post('/delete_meet', MeetActions.deleteMeetItem);
router.post('/get_meet', MeetActions.getMeetByID);
router.get('/get_all_meet', MeetActions.getAllMeetItem);

// router.post('/script_report', MeetActions.createScript);
router.post('/get_script', MeetActions.getAllScript);
router.post('/delete_script', MeetActions.deleteScript);
router.post('/update_script', MeetActions.updateScript);
router.post('/finish_meeting', MeetActions.submitScript);

router.get('/remove_all', Newactions.Remove);
router.get('/refresh_all', Newactions.Refresh);
router.get('/get_all_items', Newactions.GetAllItems);
router.get('/get_all_report', Newactions.GetAllReports);
router.get('/get_all_apply', Newactions.GetAllApplys);

router.post('/sendMessage', actions.sendMessage);
router.post('/getAllMessage', actions.getAllMessage);
router.post('/getMessage', actions.getNewMessage);
router.post('/updateMessage', actions.updateMessage);
router.post('/deleteMessage', actions.deleteMessage);

module.exports = router;
