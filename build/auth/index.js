"use strict";
exports.__esModule = true;
exports.authRouter = void 0;
var express = require("express");
var authRouter = express.Router();
exports.authRouter = authRouter;
var users_1 = require("./users");
authRouter.use(users_1.usersRouter);
authRouter.use(function (err, req, res, next) {
    if (err instanceof SyntaxError) {
        err = true;
        res.status(400);
        res.send({ message: "Malformed input, request is not a valid JSON" });
        return;
    }
    else
        next();
});
