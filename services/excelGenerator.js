const ExcelJS = require("exceljs");
const path = require("path");

const { generateSheet1 } = require("./sheet1Generator");
const { generateSheet2 } = require("./sheet2Generator");

async function generate(appState) {

    const workbook = new ExcelJS.Workbook();

    await workbook.xlsx.readFile(
        path.join(__dirname, "../templates/master.xlsx")
    );

    generateSheet1(workbook, appState);

    generateSheet2(workbook, appState);

    const outputPath = path.join(
        __dirname,
        "../output/generated.xlsx"
    );

    await workbook.xlsx.writeFile(outputPath);

    return outputPath;
}

module.exports = {
    generate
};