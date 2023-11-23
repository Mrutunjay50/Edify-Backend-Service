const router = require("express").Router();
const scoreController = require('../controllers/scores');
const isAuth = require('../middleware/is-auth'); 


router.post("/updateActionScores", isAuth, scoreController.setActionScore);

module.exports = router;