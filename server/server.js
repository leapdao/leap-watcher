import express from 'express';
import bodyParser from 'body-parser';
import Watcher from './lib/watcher';

const pino = require('express-pino-logger')();

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(pino);

// initialize Leap Watcher
let watcher = new Watcher();
watcher.init();

//
// // API
// app.get('/api/plasma_balance', (req, res) => {
//   const name = req.query.name || 'World';
//
//   res.setHeader('Content-Type', 'application/json');
//   res.send(JSON.stringify({ greeting: `Hello ${name}!` }));
// });

// App Listener
app.listen(3001, () =>
  console.log('Express server is running on localhost:3001')
);
