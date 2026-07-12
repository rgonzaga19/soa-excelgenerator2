const express = require("express");
const ExcelJS = require("exceljs");
const path = require("path");

const router = express.Router();

const { fillSheet1 } = require("../services/sheet1Generator");
const { fillSheet2 } = require("../services/sheet2Generator");

router.post("/", async (req, res) => {
    try {
        const workbook = new ExcelJS.Workbook();

        await workbook.xlsx.readFile(
            path.join(__dirname, "../templates/master.xlsx")
        );

        // ALL Sheet 1 logic happens here
        fillSheet1(workbook, req.body);
        fillSheet2(workbook, req.body);
        console.log(JSON.stringify(req.body, null, 2));

        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );

        res.setHeader(
            "Content-Disposition",
            "attachment; filename=generated.xlsx"
        );

        await workbook.xlsx.write(res);
        res.end();

    } catch (err) {

        console.error(err);

        res.status(500).json({
            error: err.message
        });

    }
});

module.exports = router;