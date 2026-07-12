const express = require("express");
const ExcelJS = require("exceljs");
const path = require("path");
const fs = require("fs");

const router = express.Router();

const { fillSheet1 } = require("../services/sheet1Generator");
const { fillSheet2 } = require("../services/sheet2Generator");

const TEMPLATE_PATH = path.join(__dirname, "../templates/master.xlsx");

// Read the template file's bytes into memory once, at startup, instead of
// hitting the filesystem on every request. workbook.xlsx.load() still has
// to parse the XLSX structure per request (ExcelJS workbooks are mutated
// in place by fillSheet1/fillSheet2, so we can't share one workbook object
// across concurrent requests) — but this removes the disk I/O from the
// hot path and only reads the file once for the life of the process.
let templateBuffer = null;

async function getTemplateBuffer() {
    if (!templateBuffer) {
        templateBuffer = await fs.promises.readFile(TEMPLATE_PATH);
    }
    return templateBuffer;
}

// Warm the cache as soon as the module loads, so the very first request
// doesn't pay the disk-read cost either.
getTemplateBuffer().catch((err) => {
    console.error("Failed to preload master.xlsx template:", err);
});

router.post("/", async (req, res) => {
    try {
        const buffer = await getTemplateBuffer();

        const workbook = new ExcelJS.Workbook();

        await workbook.xlsx.load(buffer);

        // Skip formula recalculation on load if the template doesn't need it
        workbook.calcProperties.fullCalcOnLoad = false;

        // ALL Sheet 1 logic happens here
        fillSheet1(workbook, req.body);
        fillSheet2(workbook, req.body);

        if (process.env.DEBUG) {
            console.log(JSON.stringify(req.body, null, 2));
        }

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