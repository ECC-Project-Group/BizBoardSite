const { Router } = require('express');
const { checkForExpiration } = require('../core/dates');
const { getUsers } = require('../core/sheets');
const { renderAddress, printAll } = require('../core/render');

const router = Router();

router.get('/', (_, res) => {
  getUsers().then((users) => {
    const { expired, aboutToExpire } = checkForExpiration(users);

    // Sets normal user to array not containing expired and aboutToExpire
    const normal = users.filter(
      (u) => !expired.includes(u) && !aboutToExpire.includes(u),
    );

    res.render('index', { expired, aboutToExpire, normal });
  });
});

// Download single user's envelope given {UserObject}
router.post('/downloadSingle', (req, res) => {
  if (req.body) {
    const user = req.body;

    renderAddress(user, res);
  } else {
    res.sendStatus(400);
  }
});

// Download all subscriptions, in one file
router.post('/downloadAll', (_, res) => {
  printAll(res);
});

module.exports = { router };
