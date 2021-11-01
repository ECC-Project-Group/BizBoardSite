const moment = require('moment');
// Test
// const { getUsers } = require('./sheets');

/**
 * Function that checks if users are within two weeks of expiration
 * @param {UserObject[]} users The array of users to run over
 */
function checkForExpiration(users) {
  const expired = [];
  const aboutToExpire = []; // Expiring in 2 wks;

  for (let i = 0; i < users.length; i += 1) {
    const user = users[i];

    const expiresAt = moment(user.Date, 'MM/DD/YYYY').startOf('day');
    const today = moment().startOf('day');
    const days = Math.round(moment.duration(expiresAt - today).asDays());

    if (days <= 0) {
      expired.push(user);
    } else if (days <= 14) {
      aboutToExpire.push(user);
    }
  }

  return { expired, aboutToExpire };
}

// Test
// (async function () {
//   console.log(checkForExpiration(await getUsers()));
// })();

module.exports = { checkForExpiration };
