const router = require("express").Router();
const authController = require('../controllers/auth');
const isAuth = require('../middleware/is-auth'); 

router.post('/auth/registerstudent', authController.registerStudent);
router.post('/auth/registerteacher', authController.registerTeacher);
router.post('/auth/login', authController.login);
router.put('/update/:id',  authController.updateStudent);
router.put('/updateteacher/:id',  authController.updateTeacher);
router.put('/updaterecentseen', isAuth, authController.updateRecentSeen)
router.put('/storeCompletion',isAuth, authController.updateCompletedVideos)
router.get('/auth/getuser', isAuth, authController.getUser);
router.get('/auth/leadershipScores', authController.getAllUsersTotalScores);

module.exports = router;
