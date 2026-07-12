const appState = {

    accessType: "fistula",

    fluxType: "high",

    claims: [
        {
            renderDate: "",
            hasEpo: false,
            epoQty: 1,
            epoType: "alfa",
            hasLab: false
        }
    ]

};

const claimsContainer = document.getElementById("claimsContainer");

const summary = document.getElementById("summary");

function renderClaims() {

    claimsContainer.innerHTML = "";
    const today = new Date().toISOString().split("T")[0];

    appState.claims.forEach((claim, index) => {

        claimsContainer.innerHTML += `

        <div class="claim-card">

            <h3>Claim #${index + 1}</h3>

            <div class="claim-grid">

                <div>

                    <label>Render Date</label>

                    <input
                        type="date"
                        value="${claim.renderDate}"
                        min="2020-01-01"
                        max="${today}"
                        onchange="updateDate(${index}, this.value)"
                    >

                    <small
                        id="dateError${index}"
                        style="color:red; display:none;"
                    >
                        Date cannot be in the future.
                    </small>

                </div>

                <div>

                    <label>Has EPO</label>

                    <input
                        type="checkbox"
                        ${claim.hasEpo ? "checked" : ""}
                        onchange="toggleEpo(${index},this.checked)"
                    >

                </div>

                <div>

                    <label>EPO Quantity</label>

                    <input
                        class="epo-field"
                        type="number"
                        min="1"
                        max="2"
                        value="${claim.epoQty}"
                        ${claim.hasEpo ? "" : "disabled"}
                        oninput="validateEpoQty(${index}, this)"
                        onchange="updateEpoQty(${index}, this.value)"
                    >
                    <small
                        id="epoQtyError${index}"
                        style="color:red; display:none;"
                    >
                        Maximum quantity is 2.
                    </small>

                </div>

                <div>

                    <label>EPO Type</label>

                    <select
                            class="epo-field"
                            ${claim.hasEpo ? "" : "disabled"}
                            onchange="updateEpoType(${index},this.value)"
                        >

                        <option
                            value="alfa"
                            ${claim.epoType === "alfa" ? "selected" : ""}
                        >
                            Alfa
                        </option>

                        <option
                            value="beta"
                            ${claim.epoType === "beta" ? "selected" : ""}
                        >
                            Beta
                        </option>

                    </select>

                </div>

                <div>

                    <label>Include Laboratory</label>

                    <input
                        type="checkbox"
                        ${claim.hasLab ? "checked" : ""}
                        onchange="toggleLab(${index})"
                    >

                </div>

            </div>

        </div>

        `;

    });

    renderSummary();

}

function renderSummary(){

    let html = "";

    html += `<div class="summary-item"><b>Access:</b> ${appState.accessType}</div>`;
    html += `<div class="summary-item"><b>Dialyzer:</b> ${appState.fluxType}</div>`;

    html += `<div class="summary-item"><b>Claims:</b> ${appState.claims.length}</div>`;

    const labIndex =
        appState.claims.findIndex(c=>c.hasLab);

    html += `<div class="summary-item"><b>Laboratory:</b> ${
        labIndex==-1 ? "None" : "Claim #"+(labIndex+1)
    }</div>`;

    html += "<hr><br>";

    appState.claims.forEach((c,i)=>{

        html+=`
        <div class="summary-item">

        <b>Claim ${i+1}</b><br>

        Date:
        ${c.renderDate || "-"}

        <br>
        EPO:
        ${
            c.hasEpo
                ? `${c.epoType.toUpperCase()} x${c.epoQty}`
                : "None"
        }

        ${c.hasLab ? "<br>LAB ✓" : ""}

        </div>
        `;

    });

    summary.innerHTML=html;

}

function updateDate(index, value) {

    const today = new Date().toISOString().split("T")[0];

    const error =
        document.getElementById(`dateError${index}`);

    if (value > today) {

        error.style.display = "block";

        value = today;

        // Update the visible input
        const inputs =
            document.querySelectorAll("input[type='date']");

        inputs[index].value = today;

    } else {

        error.style.display = "none";

    }

    appState.claims[index].renderDate = value;

    renderSummary();

}

function toggleEpo(index, value){

    appState.claims[index].hasEpo = value;

    if (!value) {
        appState.claims[index].epoQty = 1;
        appState.claims[index].epoType = "alfa";
    }

    renderClaims();

}

function updateEpoQty(index, value) {

    value = parseInt(value);

    if (isNaN(value) || value < 1) {
        value = 1;
    }

    if (value > 2) {
        value = 2;
    }

    appState.claims[index].epoQty = value;

    renderSummary();

}

function updateEpoType(index,value){

    appState.claims[index].epoType = value;

    renderSummary();

}

function toggleLab(index) {

    // If already checked, uncheck it
    if (appState.claims[index].hasLab) {

        appState.claims[index].hasLab = false;

    } else {

        // Otherwise make this the only checked laboratory
        appState.claims.forEach(c => c.hasLab = false);

        appState.claims[index].hasLab = true;

    }

    renderClaims();

}

document
.getElementById("claimCount")
.addEventListener("change",(e)=>{

    let count = parseInt(e.target.value);

        const error = document.getElementById("claimCountError");

        if (isNaN(count)) {
            count = 1;
        }

        if (count > 7) {

            error.style.display = "block";

            count = 7;

            e.target.value = 7;

        } else {

            error.style.display = "none";

        }

        if (count < 1) {

            count = 1;

            e.target.value = 1;

        }

    while(appState.claims.length<count){

        appState.claims.push({

            renderDate:"",
            hasEpo:false,
            epoQty:1,
            epoType:"alfa",
            hasLab:false

        });
    }

    while(appState.claims.length>count){

        appState.claims.pop();

    }

    renderClaims();

});

document
.querySelectorAll("input[name='accessType']")
.forEach(r=>{

    r.addEventListener("change",(e)=>{

        appState.accessType=e.target.value;

        renderSummary();

    });

});

document
.querySelectorAll("input[name='fluxType']")
.forEach(r => {

    r.addEventListener("change", (e) => {

        appState.fluxType = e.target.value;

        renderSummary();

    });

});

renderClaims();

async function generateExcel() {

        const missingDate = appState.claims.find(
            c => !c.renderDate
        );

        if (missingDate) {

            showToast(
                "Please enter the render date for all claims.",
                "warning"
            );

            return;

        }

        const overlay = document.getElementById("loadingOverlay");

        const btn = document.getElementById("generateBtn");

        overlay.style.display = "flex";

        btn.disabled = true;

        btn.textContent = "Generating...";



    console.log("Generate clicked");

    try {

        document.getElementById("systemStatus").textContent =
            "🟡 Generating Excel...";

        const response = await fetch("/generate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(appState)
        });

        console.log(response);

        if (!response.ok) {

            overlay.style.display = "none";

            btn.disabled = false;

            btn.textContent = "Generate Excel";

            showToast(
                "Generation failed.",
                "error"
            );

            document.getElementById("systemStatus").textContent =
                "🔴 Generation failed";

            return;

        }

        const blob = await response.blob();

        const url = window.URL.createObjectURL(blob);

        const a = document.createElement("a");

        a.href = url;
        a.download = "generated.xlsx";

        document.body.appendChild(a);

        a.click();

        a.remove();

        window.URL.revokeObjectURL(url);

            overlay.style.display = "none";

            btn.disabled = false;

            btn.textContent = "Generate Excel";

            showToast(
                "Excel generated successfully!",
                "success"
            );
        document.getElementById("systemStatus").textContent =
            "✅ Excel generated successfully";

    } catch (err) {

        document.getElementById("systemStatus").textContent =
            "🔴 Generation failed";

        overlay.style.display = "none";

        btn.disabled = false;

        btn.textContent = "Generate Excel";

        showToast(
            "Generation failed.",
            "error"
        );

        console.error(err);

    }


}

function validateEpoQty(index, input) {

    const error =
        document.getElementById(`epoQtyError${index}`);

    // Only allow 1 digit
    if (input.value.length > 1) {
        input.value = input.value.slice(0, 1);
    }

    let value = parseInt(input.value);

    if (isNaN(value) || value < 1) {

        input.value = 1;

        error.style.display = "none";

        return;

    }

    if (value > 2) {

        input.value = 2;

        error.style.display = "block";

    } else {

        error.style.display = "none";

    }

}

function clearForm() {

    // Reset access type
    appState.accessType = "fistula";

    // Reset flux type (if you've already added it)
    if ("fluxType" in appState) {
        appState.fluxType = "high";
    }

    // Reset claims
    appState.claims = [
        {
            renderDate: "",
            hasEpo: false,
            epoQty: 1,
            epoType: "alfa",
            hasLab: false
        }
    ];

    // Reset Number of Claims input
    document.getElementById("claimCount").value = 1;

    // Reset radio buttons
    document.querySelector(
        "input[name='accessType'][value='fistula']"
    ).checked = true;

    // Reset flux radio buttons if present
    const highFlux = document.querySelector(
        "input[name='fluxType'][value='high']"
    );

    if (highFlux) {
        highFlux.checked = true;
    }

    renderClaims();

}

const aboutBtn = document.getElementById("aboutBtn");
const aboutModal = document.getElementById("aboutModal");
const closeAbout = document.getElementById("closeAbout");

if (aboutBtn && aboutModal && closeAbout) {

    aboutBtn.onclick = () => {
        aboutModal.style.display = "block";
    };

    closeAbout.onclick = () => {
        aboutModal.style.display = "none";
    };

    window.onclick = (e) => {
        if (e.target === aboutModal) {
            aboutModal.style.display = "none";
        }
    };

}

function showToast(message, type = "info") {

    const toast = document.getElementById("toast");

    toast.className = `toast ${type}`;

    toast.textContent = message;

    toast.style.display = "block";

    setTimeout(() => {

        toast.style.display = "none";

    }, 3000);

}



document
    .getElementById("generateBtn")
    .addEventListener("click", generateExcel);

document
    .getElementById("clearBtn")
    .addEventListener("click", clearForm);