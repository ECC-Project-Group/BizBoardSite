const express = require('express');
const { router } = require('./router/router');

const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(router);
// app.get('/', (_, res) => {
//   res.send('hello world');
// });

module.exports = { app };
