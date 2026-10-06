var HEADERS = ["Datum", "Naam", "Email", "Instrument", "Speelduur", "Opmerking"];
var MAX_LENGTH = 500;

function doPost(e) {
  var body = {};
  try {
    body = JSON.parse(e.postData.contents);
  } catch (error) {
    body = e.parameter || {};
  }

  var sheet = findSheet(SpreadsheetApp.getActive());

  sheet.appendRow([
    new Date(),
    cell(body.naam),
    cell(body.email),
    cell(body.instrument),
    cell(body.ervaring),
    cell(body.opmerking)
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

function findSheet(spreadsheet) {
  var sheets = spreadsheet.getSheets();
  for (var i = 0; i < sheets.length; i++) {
    var row = sheets[i].getRange(1, 1, 1, HEADERS.length).getValues()[0];
    if (sameHeaders(row)) {
      return sheets[i];
    }
  }

  var sheet = sheets[0];
  if (!sheet.getRange(1, 1).getValue()) {
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
    return sheet;
  }

  sheet = spreadsheet.insertSheet("Aanmeldingen");
  sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
  return sheet;
}

function sameHeaders(row) {
  for (var i = 0; i < HEADERS.length; i++) {
    if (String(row[i] || "").replace(/^\s+|\s+$/g, "") !== HEADERS[i]) {
      return false;
    }
  }
  return true;
}

function cell(value) {
  var text = String(value || "").replace(/^\s+|\s+$/g, "").slice(0, MAX_LENGTH);
  if (/^[=+\-@]/.test(text)) {
    return "'" + text;
  }
  return text;
}

