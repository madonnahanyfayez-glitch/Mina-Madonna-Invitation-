MINA & MADONNA — RSVP GOOGLE SHEET SETUP

The invitation now includes a vintage-styled RSVP form. To make responses arrive in your private Google Sheet:

1) Create a new Google Sheet (or open the sheet where you want responses saved).
2) In the Sheet, choose Extensions > Apps Script.
3) Open Code.gs in this ZIP, copy all its contents, and paste them into the Apps Script editor, replacing the sample code. Save.
4) Choose Deploy > New deployment. Select type: Web app.
5) Set “Execute as” to Me and “Who has access” to Anyone. Deploy and authorize the script when Google asks.
6) Copy the Web app URL. It should look like https://script.google.com/macros/s/.../exec
7) Open script.js in this ZIP and replace:
   PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE
   with your copied Web app URL. Keep the quotation marks.
8) Upload the updated index.html, style.css, script.js, Code.gs, README-RSVP-SETUP.txt and all existing image/audio assets to the root of your GitHub Pages repository (replace old files).
9) Submit one test RSVP from the live invitation. A tab named “RSVP Responses” will be created automatically with Timestamp, Guest name, After-party at Gatz, and Message columns.

IMPORTANT:
- Google Sheets cannot be connected until you complete steps 1–7 and paste the deployment URL into script.js.
- The web app must be deployed with access set to Anyone so guests can submit without signing into Google.
- Do not share the Sheet itself publicly. Only the Apps Script endpoint receives form submissions.
