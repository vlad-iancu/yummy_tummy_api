"use strict";
exports.__esModule = true;
exports.usersRouter = exports.authorize = void 0;
var express = require("express");
var Database_1 = require("../data/Database");
var bodyParser = require('body-parser');
var bcrypt = require('bcrypt');
var validation = require('../validate');
var files = require('fs');
var path = require('path');
var jwt = require('jsonwebtoken');
var data_1 = require("./data");
var usersRouter = express.Router();
exports.usersRouter = usersRouter;
usersRouter.use(bodyParser.json());
console.log(__dirname);
var validator = validation.createValidator(validation.specs);
usersRouter.use(validator);
usersRouter.post("/register", function (req, res) {
    var _a = req.body, name = _a.name, email = _a.email, phone = _a.phone, password = _a.password;
    if (!email && !phone) {
        res.status(400);
        res.send({
            message: "You need to provide an email or a phone number"
        });
        res.send();
        return;
    }
    password = bcrypt.hashSync(password, 10);
    var db = new Database_1.Database();
    data_1.isDuplicateUser(db, { email: email, phone: phone })
        .then(function (result) {
        if (result.phoneDuplicate || result.emailDuplicate) {
            res.status(400);
            var email_1 = result.emailDuplicate ? "email" : "";
            var phone_1 = result.phoneDuplicate ? "phone" : "";
            var and = result.phoneDuplicate && result.emailDuplicate ? " and " : "";
            res.send({ message: "There is another user with the same " + email_1 + and + phone_1 });
        }
    });
    db.query("INSERT INTO user(name, password, email, phone) VALUES(?,?,?,?)", [name, password, email, phone])
        .then(function (result) {
        res.send({ name: name, email: email, phone: phone, id: result.insertId });
    })["catch"](function (err) {
        res.status(400);
    })["finally"](function () {
        db.close()["catch"](function (err) { });
    });
});
usersRouter.post("/login", function (req, res) {
    var _a = req.body, email = _a.email, phone = _a.phone, password = _a.password;
    if (email == null && phone == null) {
        res.status(400);
        res.send({
            message: "You need to provide an email or a phone number"
        });
    }
    var db = new Database_1.Database();
    data_1.getUser(db, { email: email, phone: phone })
        .then(function (result) {
        if (result.length != 1) {
            res.status(400);
            res.send({ message: "Cannot find any user with provided credentials" });
            return;
        }
        if (bcrypt.compareSync(password, result[0].password)) {
            var token = jwt.sign({ email: email, phone: phone, password: password }, process.env.JWT_SECRET);
            res.send({ token: token });
        }
        else {
            res.status(401);
            res.send({ message: "Incorrect password" });
        }
    })["catch"](function (err) {
        res.status(400);
        res.send(err);
    })["finally"](function () {
        db.close();
    });
});
usersRouter.get("/user", function (req, res) {
});
usersRouter["delete"]("/user", function (req, res) {
});
function authorize(req, res, next) {
}
exports.authorize = authorize;
