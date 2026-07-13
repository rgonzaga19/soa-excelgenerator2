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

// ── License settings ─────────────────────────────────────────────
// TODO: replace with your actual Cloudflare Worker URL and adjust the
// expected response shape below (validateLicenseKey) to match what it
// actually returns.
const LICENSE_VALIDATION_URL = "https://beabot-license.gonzagaromel19.workers.dev";
const LICENSE_STORAGE_KEY = "soaLicenseKey";
const LICENSE_REQUEST_TIMEOUT_MS = 10000; // matches the Python client's timeout=10

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

// ── Theme (dark mode) ────────────────────────────────────────────
// Note: the initial theme is already applied by an inline script in
// <head> before this file loads (avoids a flash of the light theme).
// This section just wires up the toggle button and keeps localStorage
// in sync with whatever the user picks from here on.

const THEME_STORAGE_KEY = "soaTheme";

function getCurrentTheme() {
    return document.documentElement.getAttribute("data-theme") === "dark"
        ? "dark"
        : "light";
}

function applyTheme(theme) {

    document.documentElement.setAttribute("data-theme", theme);

    try {
        localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch (e) {
        // localStorage unavailable — theme just won't persist across restarts.
    }

    const btn = document.getElementById("themeToggleBtn");

    if (btn) {
        btn.textContent = theme === "dark" ? "☀ Light" : "🌙 Dark";
    }

}

function toggleTheme() {
    applyTheme(getCurrentTheme() === "dark" ? "light" : "dark");
}

// Sync the button label with whatever theme the inline head script already
// applied, so the icon/text is correct on first render.
applyTheme(getCurrentTheme());

document
    .getElementById("themeToggleBtn")
    .addEventListener("click", toggleTheme);

// ── License settings helpers ────────────────────────────────────

// Cached result of the most recent successful validation, so the Settings
// panel can show owner/plan/expiry instead of just a masked key once we've
// actually confirmed the key against the server.
let lastLicenseInfo = null;

function getSavedLicenseKey() {
    return (localStorage.getItem(LICENSE_STORAGE_KEY) || "").trim();
}

function saveLicenseKey(key) {
    localStorage.setItem(LICENSE_STORAGE_KEY, key.trim());
    // A newly-entered key hasn't been validated yet — drop any cached
    // info from a previous (different) key so the status display doesn't
    // show stale owner/plan details for a key that's since changed.
    lastLicenseInfo = null;
}

function updateLicenseStatusText() {

    const statusEl = document.getElementById("licenseStatus");
    const savedKey = getSavedLicenseKey();

    if (!savedKey) {
        statusEl.textContent = "No license key saved yet.";
        statusEl.className = "license-status";
        return;
    }

    if (lastLicenseInfo && lastLicenseInfo.valid) {

        const parts = [];

        if (lastLicenseInfo.owner) parts.push(lastLicenseInfo.owner);
        if (lastLicenseInfo.plan) parts.push(`${lastLicenseInfo.plan} plan`);
        if (lastLicenseInfo.expires) parts.push(`expires ${lastLicenseInfo.expires}`);

        statusEl.textContent = parts.length
            ? `Licensed to ${parts.join(" — ")}`
            : "License verified.";

        statusEl.className = "license-status saved";

        return;

    }

    // A confirmed rejection (invalid key or expired license) from the
    // server — show the server's own explanation rather than a generic
    // "not yet verified", since we actually know why it failed.
    if (lastLicenseInfo && (lastLicenseInfo.reason === "invalid" || lastLicenseInfo.reason === "expired")) {
        statusEl.textContent = lastLicenseInfo.message || "This license key was rejected by the server.";
        statusEl.className = "license-status invalid";
        return;
    }

    // Saved but not yet (re)verified this session — mask all but the
    // last 4 characters so it's clear a key is saved without displaying
    // it in full every time the modal opens.
    const masked =
        savedKey.length > 4
            ? "•".repeat(savedKey.length - 4) + savedKey.slice(-4)
            : "••••";

    statusEl.textContent = `Saved key: ${masked} (not yet verified)`;
    statusEl.className = "license-status";

}

function openSettingsModal() {

    const modal = document.getElementById("settingsModal");
    const input = document.getElementById("licenseKeyInput");

    input.value = getSavedLicenseKey();
    document.getElementById("licenseError").style.display = "none";

    updateLicenseStatusText();

    modal.style.display = "block";

}

function closeSettingsModal() {
    document.getElementById("settingsModal").style.display = "none";
}

// Calls the Cloudflare license server. Matches worker.js exactly:
//   - POST { license: <key> }, 10 second timeout
//   - Almost every outcome is HTTP 200 with { valid, reason?, owner?,
//     plan?, expires? } in the body — the worker only uses non-200 for
//     405 (wrong method) and 400 (malformed request), and even those
//     bodies carry a JSON "reason".
//   - An expired license comes back as { valid: false, reason: "License
//     expired", owner, plan, expires } — still rejected, but with enough
//     detail to tell the user *why* rather than a flat "invalid".
// Returns { valid, owner?, plan?, expires?, reason?, message? } — reason
// and message are only present when valid is false.
async function validateLicenseKey(key) {

    if (!key) {
        return {
            valid: false,
            reason: "empty",
            message: "Please enter a license key."
        };
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(
        () => controller.abort(),
        LICENSE_REQUEST_TIMEOUT_MS
    );

    try {

        const response = await fetch(LICENSE_VALIDATION_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ license: key.trim() }),
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        // The worker returns a JSON body with a "reason" field on every
        // status code it uses (200, 400, 405), so parse first and only
        // fall back to a generic HTTP message if the body itself isn't
        // valid JSON (e.g. an upstream/network failure Cloudflare itself
        // returned an HTML error page for).
        let data;

        try {
            data = await response.json();
        } catch (parseErr) {
            return {
                valid: false,
                reason: "server",
                message: `License server returned HTTP ${response.status}`
            };
        }

        if (!response.ok) {
            return {
                valid: false,
                reason: "server",
                message: data.reason || `License server returned HTTP ${response.status}`
            };
        }

        if (!data.valid) {

            const isExpired = data.reason === "License expired";

            let message = data.reason || "Invalid license key. Please check Settings.";

            if (isExpired && data.expires) {
                const details = [data.owner, data.plan && `${data.plan} plan`]
                    .filter(Boolean)
                    .join(", ");
                message = `License expired on ${data.expires}` + (details ? ` (${details})` : "");
            }

            return {
                valid: false,
                reason: isExpired ? "expired" : "invalid",
                message,
                owner: data.owner,
                plan: data.plan,
                expires: data.expires
            };

        }

        return {
            valid: true,
            owner: data.owner,
            plan: data.plan,
            expires: data.expires
        };

    } catch (err) {

        clearTimeout(timeoutId);

        console.error("License validation request failed:", err);

        if (err.name === "AbortError") {
            return {
                valid: false,
                reason: "timeout",
                message: "Connection to the license server timed out."
            };
        }

        return {
            valid: false,
            reason: "network",
            message: "Unable to connect to the license server."
        };

    }

}

document
    .getElementById("settingsBtn")
    .addEventListener("click", openSettingsModal);

document
    .getElementById("closeSettings")
    .addEventListener("click", closeSettingsModal);

document
    .getElementById("saveLicenseBtn")
    .addEventListener("click", () => {

        const input = document.getElementById("licenseKeyInput");
        const error = document.getElementById("licenseError");

        const key = input.value.trim();

        if (!key) {
            error.style.display = "block";
            return;
        }

        error.style.display = "none";

        saveLicenseKey(key);

        updateLicenseStatusText();

        showToast("License key saved.", "success");

    });

// ── Excel generation ─────────────────────────────────────────────

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

        const savedKey = getSavedLicenseKey();

        if (!savedKey) {

            showToast(
                "Please enter your license key in Settings before generating.",
                "warning"
            );

            openSettingsModal();

            return;

        }

        const overlay = document.getElementById("loadingOverlay");
        const loadingText = document.getElementById("loadingText");

        const btn = document.getElementById("generateBtn");

        overlay.style.display = "flex";

        btn.disabled = true;
        loadingText.textContent = "Validating license...";
        btn.textContent = "Validating...";

        document.getElementById("systemStatus").textContent =
            "🟡 Validating license...";

        const licenseResult = await validateLicenseKey(savedKey);

        if (!licenseResult.valid) {

            overlay.style.display = "none";

            btn.disabled = false;
            btn.textContent = "Generate Excel";

            const message =
                licenseResult.message
                || "Invalid license key. Please check Settings.";

            showToast(message, "error");

            document.getElementById("systemStatus").textContent =
                "🔴 License check failed";

            // Cache the failure (invalid/expired/etc.) so Settings can show
            // *why* it failed next time it's opened, instead of just a
            // masked "not yet verified" key.
            lastLicenseInfo = licenseResult;

            // Only pop Settings open for cases the user can fix by editing
            // the key there (invalid, expired, or missing). A timeout or
            // network/server error isn't something re-typing the key fixes,
            // so don't yank focus away from the form for those — the toast
            // already told them what happened.
            if (licenseResult.reason === "invalid" || licenseResult.reason === "expired" || licenseResult.reason === "empty") {
                openSettingsModal();
            }

            return;

        }

        // Cache the verified owner/plan/expiry so the Settings panel can
        // show it next time it's opened, instead of just a masked key.
        lastLicenseInfo = licenseResult;

        loadingText.textContent = "Generating Excel...";
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
        if (e.target === document.getElementById("settingsModal")) {
            closeSettingsModal();
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