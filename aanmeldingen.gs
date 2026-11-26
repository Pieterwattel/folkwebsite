var HEADERS = ["Datum", "Naam", "Email", "Instrument", "Speelduur", "Opmerking"];
var MAX_LENGTH = 500;

function doPost(e) {
  var body = {};
  try {
    body = JSON.parse(e.postData.contents);
  } catch (error) {
    body = e.parameter || {};
  }

  if (body.type === "geen-toestemming") {
    sendRefusal(body);
    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
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

var REFUSAL_EMAIL = "pieterwattel@gmail.com";

// From the hidden video page: someone does not give permission for a video.
function sendRefusal(body) {
  var naam = String(body.naam || "").slice(0, 200);
  var bericht = String(body.bericht || "").slice(0, 3000);
  MailApp.sendEmail({
    to: REFUSAL_EMAIL,
    subject: (body.toestemming === "bericht" ? "Bericht video folksessie: " : "Geen toestemming video folksessie: ") + naam,
    body: "Naam: " + naam + "\n\n" + bericht
  });
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

