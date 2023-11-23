const router = require("express").Router();

const pdfController = require('../controllers/pdf')

router.post('/create-pdf', pdfController.createPdf);
router.get('/fetch-pdf', pdfController.getPDF);

module.exports = router;