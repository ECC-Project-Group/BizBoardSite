const { GoogleSpreadsheet } = require('google-spreadsheet');

const doc = new GoogleSpreadsheet(
  //! ! Leaving my public api key here. Please don't abuse it.
  '1R3FEuZara22iPOcLsTEQT7Jbw7jiSPWVN_RnMo4CQZw',
);

async function getUsers() {
  doc.useApiKey('AIzaSyBEXka1tD_WAR-hU96m75dhmTJ5HsoZUaI');
  await doc.loadInfo(); // loads document properties and worksheets
  const sheet = doc.sheetsByIndex[0];

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
