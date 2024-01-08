const router = require("express").Router();
const authStudent = require('../controllers/authStudent');
const authTeacher = require('../controllers/authTeacher');
const isAuth = require('../middleware/is-auth'); 

router.post('/auth/registerstudent', authStudent.registerStudent);
router.post('/auth/registerteacher', authTeacher.registerTeacher);
router.post('/auth/loginstudent', authStudent.login);
router.post('/auth/loginteacher', authTeacher.login);
router.put('/update/:id',  authStudent.updateStudent);
router.put('/updateteacher/:id',  authTeacher.updateTeacher);
router.put('/updaterecentseen', isAuth, authStudent.updateRecentSeen)
router.put('/storeCompletion',isAuth, authStudent.updateCompletedVideos)
router.get('/auth/getuser/student', authStudent.getUser);
router.get('/auth/leadershipScores', authStudent.getAllUsersTotalScores);

module.exports = router;
