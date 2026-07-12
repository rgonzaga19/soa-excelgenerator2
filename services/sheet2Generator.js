const { getRoomBoardPrices } = require("./roomBoardPricing");


function fillSheet2(workbook, data) {

    const sheet = workbook.getWorksheet(2);

    // Delete the original template data block
    sheet.spliceRows(3, 8);



    const isSubkit = data.accessType === "subkit";
    const isLowFlux = data.fluxType === "low";

    let currentRow = 3;

    for (const claim of data.claims) {
    
    const roomBoard = getRoomBoardPrices(claim);

    const sheet2Rows = [

            {
                type: "Supplies",
                description: "DIALYZER",
                qty: 1,
                price: 500,
                esoaGroup: "MedicalSupplies",
                unit: "PIECE",
                mapping: isLowFlux
                        ? "LOW FLUX DIALYZER OR ITS EQUIVALENT"
                        : "DIALYZER, CELLULOSE HIGH EFFICIENCY AM-SD-750U"
            },
            {
                type: "Supplies",
                description: "BLOODLINES",
                qty: 1,
                price: 312.50,
                esoaGroup: "MedicalSupplies",
                unit: "PIECE",
                mapping: "BLOODLINES"
            },
            {
                type: isSubkit ? "Supplies" : "Others",
                description: isSubkit
                    ? "Sterile Dressing Kit"
                    : "Fistula Needles with Safety",
                qty: 1,
                price: 312.50,
                esoaGroup: isSubkit
                    ? "MedicalSupplies"
                    : "Others",
                unit: isSubkit
                    ? "KIT"
                    : "",
                mapping: isSubkit
                    ? "DRESSING KIT"
                    : "Others"
            },
            {
                type: "Supplies",
                description: isSubkit
                    ? "SUBCLAVIAN KIT"
                    : "FISTULA KIT",
                qty: 1,
                price: 312.50,
                esoaGroup: "MedicalSupplies",
                unit: "KIT",
                mapping: isSubkit
                    ? "IJ CATHETER FR. 12"
                    : "FISTULA KIT"
            },
                   
            {
                type: "Others",
                description: "Room and Board - Use of Machines",
                qty: 1,
                price: roomBoard.roomUseMachine,
                esoaGroup: "RoomAndBoard",
                unit: "",
                mapping: "ROOM AND BOARD"
            },
            {
                type: "Others",
                description: "Room and Board - Personnel Costs",
                qty: 1,
                price: roomBoard.personnelCost,
                esoaGroup: "RoomAndBoard",
                unit: "",
                mapping: "ROOM AND BOARD"
            },
            {
                type: "Others",
                description: "Room and Board - Rentals and Utilities",
                qty: 1,
                price: roomBoard.rentalUtilities,
                esoaGroup: "RoomAndBoard",
                unit: "",
                mapping: "ROOM AND BOARD"
            },
            {
                type: "Others",
                description: "Room and Board - Other Administrative Costs",
                qty: 1,
                price: roomBoard.adminCost,
                esoaGroup: "RoomAndBoard",
                unit: "",
                mapping: "ROOM AND BOARD"
            }
        ];
    
        
        const laboratoryRows = [
            {
                type: "LABORATORY",
                description: "Chemistry - Sodium",
                qty: 1,
                price: 175.00,
                esoaGroup: "LaboratoryAndDiagnostic",
                unit: "",
                mapping: "CHEMISTRY: SODIUM"
            },
            {
                type: "LABORATORY",
                description: "Chemistry - Potassium",
                qty: 1,
                price: 175.00,
                esoaGroup: "LaboratoryAndDiagnostic",
                unit: "",
                mapping: "CHEMISTRY: POTASSIUM"
            },
            {
                type: "LABORATORY",
                description: "Chemistry - Serum Calcium",
                qty: 1,
                price: 175.00,
                esoaGroup: "LaboratoryAndDiagnostic",
                unit: "",
                mapping: "CHEMISTRY: SERUM CALCIUM"
            },
            {
                type: "LABORATORY",
                description: "Chemistry - BUN",
                qty: 1,
                price: 250.00,
                esoaGroup: "LaboratoryAndDiagnostic",
                unit: "",
                mapping: "CHEMISTRY: BUN"
            },
            {
                type: "LABORATORY",
                description: "Chemistry - URIC ACID",
                qty: 1,
                price: 250.00,
                esoaGroup: "LaboratoryAndDiagnostic",
                unit: "",
                mapping: "CHEMISTRY: URIC ACID"
            },
            {
                type: "LABORATORY",
                description: "Chemistry - Creatinine",
                qty: 1,
                price: 200.00,
                esoaGroup: "LaboratoryAndDiagnostic",
                unit: "",
                mapping: "CHEMISTRY: CREATININE"
            },
            {
                type: "LABORATORY",
                description: "Chemistry - UREAN NITROGEN",
                qty: 1,
                price: 175.00,
                esoaGroup: "LaboratoryAndDiagnostic",
                unit: "",
                mapping: "CHEMISTRY: URINE-UREAN NITROGEN"
            },
            {
                type: "LABORATORY",
                description: "Chemistry - Serum Albumin",
                qty: 1,
                price: 175.00,
                esoaGroup: "LaboratoryAndDiagnostic",
                unit: "",
                mapping: "CHEMISTRY: SERUM ALBUMIN"
            },
            {
                type: "LABORATORY",
                description: "Chemistry - Phosphorous",
                qty: 1,
                price: 175.00,
                esoaGroup: "LaboratoryAndDiagnostic",
                unit: "",
                mapping: "CHEMISTRY: PHOSPHOROUS"
            },
            {
                type: "LABORATORY",
                description: "Hematology - CBC",
                qty: 1,
                price: 250.00,
                esoaGroup: "LaboratoryAndDiagnostic",
                unit: "",
                mapping: "CHEMISTRY: CBC"
            }
        ];

        if (claim.hasLab) {
            sheet2Rows.push(...laboratoryRows);
        }



    for (let i = 0; i < sheet2Rows.length; i++) {
        sheet.insertRow(currentRow + i, []);
    }        

    for (let i = 0; i < sheet2Rows.length; i++) {

        const row = sheet2Rows[i];  

        sheet.getCell(`A${currentRow + i}`).value = row.type;
        sheet.getCell(`B${currentRow + i}`).value = row.description;

        sheet.getCell(`C${currentRow + i}`).value = row.qty;

        const priceCell = sheet.getCell(`D${currentRow + i}`);
        priceCell.value = row.price;
        priceCell.numFmt = "0.00";

        const totalCell = sheet.getCell(`E${currentRow + i}`);
        totalCell.value = row.qty * row.price;
        totalCell.numFmt = "0.00";

        const dateCell = sheet.getCell(`F${currentRow + i}`);
        dateCell.value = new Date(claim.renderDate);
        dateCell.numFmt = "m/d/yyyy";

        sheet.getCell(`G${currentRow + i}`).value = row.esoaGroup;
        sheet.getCell(`H${currentRow + i}`).value = row.unit;
        sheet.getCell(`I${currentRow + i}`).value = row.mapping;
    }

    currentRow += sheet2Rows.length;
    
    }
    
}

module.exports = {
    fillSheet2
};