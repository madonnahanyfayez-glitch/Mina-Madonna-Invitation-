const SPREADSHEET_ID = '1-ZqNXJRNgjRQ1T67JlbUqq8pn_VTqzPjh4g2Jwq0VJI';

function doPost(e) {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = ss.getSheetByName('RSVP Responses');
    if (!sheet) {
      sheet = ss.insertSheet('RSVP Responses');
      sheet.appendRow(['Timestamp', 'Guest Name', 'After-party at Gatz']);
      sheet.setFrozenRows(1);
    }
    const p = (e && e.parameter) ? e.parameter : {};
    const name = String(p.name || '').trim();
    const attendance = String(p.attendance || '').trim();
    if (!name || !attendance) throw new Error('Name and attendance are required.');
    if (name.length > 120) throw new Error('Name is too long.');
    sheet.appendRow([new Date(), name, attendance]);
    return ContentService.createTextOutput('OK').setMimeType(ContentService.MimeType.TEXT);
  } catch (err) {
    return ContentService.createTextOutput('ERROR: ' + err.message).setMimeType(ContentService.MimeType.TEXT);
  }
}
