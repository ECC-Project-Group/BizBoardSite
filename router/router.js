const { Router } = require('express');
const { checkForExpiration } = require('../core/dates');
const { getUsers } = require('../core/sheets');
const { renderAddress } = require('../core/render');

const router = Router();

router.get('/', (_, res) => {
  getUsers().then((users) => {
    const { expired, aboutToExpire } = checkForExpiration(users);
    res.render('index', { expired, aboutToExpire });
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

module.exports = { router };
