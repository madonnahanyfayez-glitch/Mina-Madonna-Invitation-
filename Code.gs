/**
 * Mina & Madonna wedding RSVP collector.
 * Create/open the Google Sheet, then Extensions > Apps Script and paste this file.
 * Deploy as a Web app: Execute as Me; Who has access: Anyone.
 */
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('RSVP Responses');
    if (!sheet) {
      sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet('RSVP Responses');
      sheet.appendRow(['Timestamp', 'Guest name', 'After-party at Gatz', 'Message']);
      sheet.setFrozenRows(1);
    }
    var p = (e && e.parameter) ? e.parameter : {};
    var name = String(p.name || '').trim();
    var attendance = String(p.attendance || '').trim();
    var message = String(p.message || '').trim();
    if (!name || !attendance) throw new Error('Name and attendance are required.');
    if (name.length > 120 || message.length > 1500) throw new Error('Input is too long.');
    sheet.appendRow([new Date(), name, attendance, message]);
    return ContentService.createTextOutput('OK').setMimeType(ContentService.MimeType.TEXT);
  } catch (err) {
    return ContentService.createTextOutput('ERROR: ' + err.message).setMimeType(ContentService.MimeType.TEXT);
  }
}
