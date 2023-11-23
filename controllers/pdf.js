const pdf = require('html-pdf');
const pdfTemplate = require('../documents/index');
const path = require('path');

exports.createPdf = async (req, res, next) => {
    
    try {
        const outputPath = path.join(__dirname, 'pdf', 'test.pdf'); // Define the output path

        const pdfPromise = new Promise((resolve, reject) => {
            pdf.create(pdfTemplate(req.body), {}).toFile(outputPath, (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });

        await pdfPromise;
        res.send(Promise.resolve());
    } catch (error) {
        res.send(Promise.reject(error));
    }
};

exports.getPDF = (req, res, next) => {
    const pdfPath = path.join(__dirname, 'pdf', 'test.pdf'); // Define the path to the PDF
    res.sendFile(pdfPath);
};