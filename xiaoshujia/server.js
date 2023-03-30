const expressApp = require('./app');

require('./cloud');
require('dotenv').config();
'use strict';

const AV = require('leanengine');
const express = require('express');
// console.log("当前环境变量的appid:");
// console.log(process.env.LEANCLOUD_APP_ID);
console.log('LEANCLOUD_APP_ID:', process.env.LEANCLOUD_APP_ID);
console.log('LEANCLOUD_APP_KEY:', process.env.LEANCLOUD_APP_KEY);
console.log('LEANCLOUD_APP_MASTER_KEY:', process.env.LEANCLOUD_APP_MASTER_KEY);

AV.init({
  appId: process.env.LEANCLOUD_APP_ID,
  appKey: process.env.LEANCLOUD_APP_KEY,
  masterKey: process.env.LEANCLOUD_APP_MASTER_KEY,
  serverURLs: "https://xjjkm8ub.lc-cn-n1-shared.com",
});

// Comment the following line if you do not want to use masterKey.
AV.Cloud.useMasterKey();

// const app = express();

expressApp.use(AV.express());
expressApp.enable('trust proxy');
expressApp.use(AV.Cloud.HttpsRedirect());

expressApp.get('/', (req, res) => {
  res.send('Hello, World!');
});

// Retrieves the port number from environment variable `LEANCLOUD_APP_PORT`.
// LeanEngine runtime will assign a port and set the environment variable automatically.
const PORT = parseInt(process.env.LEANCLOUD_APP_PORT || process.env.PORT || 3000);

expressApp.listen(PORT, (err) => {
  console.log('Node app is running on port:', PORT);

  // Registers a global exception handler for uncaught exceptions.
  process.on('uncaughtException', (err) => {
    console.error('Caught exception:', err.stack);
  });
  process.on('unhandledRejection', (reason, p) => {
    console.error('Unhandled Rejection at: Promise ', p, ' reason: ', reason.stack);
  });
});

// 'use strict'

// const AV = require('leanengine')

// AV.init({
//   appId: process.env.LEANCLOUD_APP_ID,
//   appKey: process.env.LEANCLOUD_APP_KEY,
//   masterKey: process.env.LEANCLOUD_APP_MASTER_KEY
// })

// // Comment the following line if you do not want to use masterKey.
// AV.Cloud.useMasterKey()

// const app = require('./app')

// // Retrieves the port number from environment variable `LEANCLOUD_APP_PORT`.
// // LeanEngine runtime will assign a port and set the environment variable automatically.
// const PORT = parseInt(process.env.LEANCLOUD_APP_PORT || process.env.PORT || 3000)

// app.listen(PORT, (err) => {
//   console.log('Node app is running on port:', PORT)

//   // Registers a global exception handler for uncaught exceptions.
//   process.on('uncaughtException', err => {
//     console.error('Caught exception:', err.stack)
//   });
//   process.on('unhandledRejection', (reason, p) => {
//     console.error('Unhandled Rejection at: Promise ', p, ' reason: ', reason.stack)
//   })
// })
