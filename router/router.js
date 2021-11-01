const { Router } = require('express');
const { checkForExpiration } = require('../core/dates');
const { getUsers } = require('../core/sheets');

const router = Router();

router.get('/', (_, res) => {
  getUsers().then((users) => {
    const { expired, aboutToExpire } = checkForExpiration(users);
    res.render('index', { expired, aboutToExpire });
  });
});

module.exports = { router };
