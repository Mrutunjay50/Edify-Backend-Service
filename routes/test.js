const router = require("express").Router();
const testContoller = require("../controllers/test");

// router.post('/create/question', testContoller.createQuestion);
router.post('/createquestion', testContoller.createTestSheets);
router.post('/getScoreFromSheets', testContoller.getTestScore);

module.exports = router;