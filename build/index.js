var express = require('express');
var https = require('https');
var app = express();
var authRouter = require('./auth').authRouter;
var ssl = require('../ssl');
var files = require('fs');
var path = require('path');
app.use(authRouter);
https.createServer(ssl.credentials, app).listen(process.env.PORT, function () {
    console.log("App listening on https://localhost");
});
