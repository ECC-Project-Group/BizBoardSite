const { GoogleSpreadsheet } = require('google-spreadsheet');

const doc = new GoogleSpreadsheet(process.env.SHEET_ID);

async function getUsers() {
  doc.useApiKey(process.env.API_KEY);
  await doc.loadInfo(); // Loads sheet data
  const sheet = doc.sheetsByIndex[0]; // Gets first sheet

  const rows = await sheet.getRows();

  /**
   * @interface UserObject Object syntax for users from sheets row, notice capitalization
   * @property {String} First First name of the subscriber
   * @property {String} Last Last name of subscriber
   * @property {String} Address ...
   * @property {String} City ...
   * @property {String} State ...
   * @property {String} Zip ...
   * @property {String} Country ...
   * @property {Date} Date Expiration date, preferably formatted via Moment
   */

  const users = []; // Array of {UserObject}

  for (let i = 0; i < rows.length; i += 1) {
    const row = rows[i];

    // Fastest implementation. No alternatives found.
    // Converts class into plain {UserObject}
    const tmp = {
      First: row.First,
      Last: row.Last,
      Address: row.Address,
      City: row.City,
      State: row.State,
      Zip: row.Zip,
      Country: row.Country,
      Date: row.Date,
    };

    users.push(tmp);
  }

  return users;
}

module.exports = { getUsers };

// Test
// (async function () {
//   console.log(await getUsers());
// })();
