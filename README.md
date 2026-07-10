# SOA Excel Generator

PhilHealth Statement of Account (SOA) Generator built with Node.js and ExcelJS.

## Features

* Dynamic Sheet 1 generation
* Dynamic Sheet 2 generation
* Multiple claims support
* Fistula / Subkit support
* EPO Alfa support
* EPO Beta support
* Single and Double Dose (Alfa)
* Laboratory support
* Dynamic Room & Board pricing
* Automatic Excel generation based on business rules
* Preserves required workbook structure for third-party uploads

---

## Requirements

* Node.js (LTS recommended)
* Git

Verify installation:

```bash
node -v
npm -v
git --version
```

---

## Clone the Repository

SSH:

```bash
git clone git@github.com:YOUR_GITHUB_USERNAME/soa-generator.git
```

or HTTPS:

```bash
git clone https://github.com/YOUR_GITHUB_USERNAME/soa-generator.git
```

Enter the project folder:

```bash
cd soa-generator
```

---

## Install Dependencies

```bash
npm install
```

This will automatically install all required packages from `package.json`.

---

## Run the Application

If using the current setup:

```bash
node server.js
```

Open your browser:

```
http://localhost:3000
```

---

## Project Structure

```
soa-generator/
│
├── public/
│   ├── css/
│   └── js/
│
├── routes/
│
├── services/
│   ├── sheet1Generator.js
│   ├── sheet2Generator.js
│   └── roomBoardPricing.js
│
├── templates/
│   └── master.xlsx
│
├── server.js
├── package.json
└── README.md
```

---

## Current Business Rules

### Access Types

* Fistula
* Subkit

### EPO Types

* Alfa
* Beta

### Laboratory

* Optional laboratory rows
* Laboratory rows are appended immediately after the corresponding claim on Sheet 2

### Multiple Claims

* Supports multiple claims in one generated workbook
* Dates are automatically propagated to all related rows

### Room & Board Pricing

Dynamic pricing based on:

* No EPO / No Laboratory
* No EPO / Laboratory
* EPO Alfa / No Laboratory
* EPO Alfa / Laboratory
* EPO Beta / No Laboratory
* EPO Beta / Laboratory
* EPO Alfa Double Dose / No Laboratory
* EPO Alfa Double Dose / Laboratory

---

## Development Workflow

Check status:

```bash
git status
```

Stage changes:

```bash
git add .
```

Commit:

```bash
git commit -m "Your commit message"
```

Push:

```bash
git push
```

Pull latest changes:

```bash
git pull
```

---

## Notes

* Do not commit `node_modules/`
* Do not commit sensitive credentials
* Keep `templates/master.xlsx` synchronized with the required third-party upload format
* Always create a Git commit before implementing major business rule changes
