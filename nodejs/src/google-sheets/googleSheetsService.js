const { google } = require('googleapis');
const sheets = google.sheets('v4');

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
const KEY_FILE = "./google-sheets/google-sheets-api-credentials.json";

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

async function getSpreadSheetValues({spreadsheetId, auth, sheetName}) {
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    auth,
    range: sheetName
  });
  return res;
}

async function getSpreadSheetValuesV2(spreadsheetId, sheetName) {
      console.log(333333 + spreadsheetId + sheetName);
  try {
      const auth = await getAuthToken();
      const response = await getSpreadSheetValues({
        spreadsheetId,
        sheetName,
        auth
      });
      return response.data;
      // console.log('output for getSpreadSheetValues', JSON.stringify(response.data, null, 2));
  } catch(error) {
      console.log(error.message, error.stack);
      return null;
  }
}

module.exports = {
  getAuthToken,
  getSpreadSheet,
  getSpreadSheetValues
}
