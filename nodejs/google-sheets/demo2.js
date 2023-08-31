const { google } = require('googleapis');
const sheets = google.sheets('v4');

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
const KEY_FILE = "./google-sheets-api-credentials.json";
var spreadsheetId = "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms";
var sheetName = "Class Data!A1:E5";

async function getAuthToken() {
  const auth = new google.auth.GoogleAuth({
    keyFile: KEY_FILE,
    scopes: SCOPES
  });
  const authToken = await auth.getClient();
  return authToken;
}

async function getSpreadSheet({spreadsheetId, auth}) {
  const res = await sheets.spreadsheets.get({
    spreadsheetId,
    auth,
  });
  return res;
}

async function getSpreadSheetValues({spreadsheetId, sheetName, auth}) {
  console.log("spreadsheetId: " + spreadsheetId);
  console.log("sheetName: " + sheetName);
  // console.log(auth);
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    auth,
    range: sheetName
  });
  return res;
}

async function getSpreadSheetValuesData(spreadsheetId, sheetName) {
  try {
    const auth = await getAuthToken();
    const response = await getSpreadSheetValues({
      spreadsheetId,
      sheetName,
      auth
    });
    // console.log("getSpreadSheet start: -------");
    // console.log(await getSpreadSheet({spreadsheetId, auth}));
    // console.log("getSpreadSheet end: -------");
    console.log(response.data);
  } catch(error) {
    console.log(error.message, error.stack);
  }
}

getSpreadSheetValuesData(spreadsheetId, sheetName);
