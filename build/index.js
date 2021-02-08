"use strict";
exports.__esModule = true;
var restaurants_1 = require("./restaurants");
var auth_1 = require("./auth");
var express = require('express');
var https = require('https');
var app = express();
var ssl = require('../ssl');
var files = require('fs');
var path = require('path');
app.use(auth_1.authRouter);
app.use(restaurants_1.restaurantRouter);
https.createServer(ssl.credentials, app).listen(process.env.PORT, function () {
    console.log("App listening on https://localhost");
});
//# sourceMappingURL=index.js.map