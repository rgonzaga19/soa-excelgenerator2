const ExcelJS = require("exceljs");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");

const { fillSheet1 } = require("./sheet1Generator");
const { fillSheet2 } = require("./sheet2Generator");

const TEMPLATE_PATH = path.join(__dirname, "../templates/master.xlsx");
const OUTPUT_DIR = path.join(__dirname, "../output");

// Cached once at process start — master.xlsx is bundled into the exe and
// never changes while the server is running, so there's no need to re-read
// it from disk on every call.
let templateBuffer = null;

async function getTemplateBuffer() {
    if (!templateBuffer) {
        templateBuffer = await fs.promises.readFile(TEMPLATE_PATH);
    }
    return templateBuffer;
}

getTemplateBuffer().catch((err) => {
    console.error("Failed to preload master.xlsx template:", err);
});

async function generate(appState) {

    const buffer = await getTemplateBuffer();

    const workbook = new ExcelJS.Workbook();

    await workbook.xlsx.load(buffer);

    workbook.calcProperties.fullCalcOnLoad = false;

    fillSheet1(workbook, appState);

    fillSheet2(workbook, appState);

    // Unique filename per call — a fixed path here would let concurrent
    // requests overwrite each other's output or read a half-written file.
    const outputPath = path.join(
        OUTPUT_DIR,
        `generated-${crypto.randomUUID()}.xlsx`
    );

    await workbook.xlsx.writeFile(outputPath);

    return outputPath;
}

module.exports = {
    generate
};