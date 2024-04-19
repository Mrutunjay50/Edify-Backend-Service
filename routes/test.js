const router = require("express").Router();
const testContoller = require("../controllers/test");
const isTeacher = require('../middleware/isTeacher');

// router.post('/create/question', testContoller.createQuestion);
// router.post('/createquestion', testContoller.createTestSheets);
// router.post('/getScoreFromSheets', testContoller.getTestScore);


router.post('/create-test',isTeacher, testContoller.createTest);
router.get('/get-one-test/:id', testContoller.getOneTest);
router.get('/get-alltest', testContoller.getAllTests);

module.exports = router;