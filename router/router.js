const { Router } = require('express');
const { checkForExpiration } = require('../core/dates');
const { getUsers } = require('../core/sheets');
const { renderAddress, printAll } = require('../core/render');

const router = Router();

router.get('/', (_, res) => {
  getUsers().then((users) => {
    const { expired, aboutToExpire } = checkForExpiration(users);

    const normal = users.filter(
      (u) => !expired.includes(u) && !aboutToExpire.includes(u),
    );

    res.render('index', { expired, aboutToExpire, normal });
  });
});

router.post('/render', (req, res) => {
  if (req.body) {
    const user = req.body;

    renderAddress(user, res);
  } else {
    res.sendStatus(400);
  }
});

router.get('/printAll', (_, res) => {
  printAll(res);
});

module.exports = { router };
