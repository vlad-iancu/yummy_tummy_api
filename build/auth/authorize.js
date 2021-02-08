"use strict";
exports.__esModule = true;
exports.authorize = void 0;
var Database_1 = require("../data/Database");
var data_1 = require("./data");
var jsonwebtoken_1 = require("jsonwebtoken");
var bcrypt_1 = require("bcrypt");
function authorize(req, res, next) {
    var token = req.headers.authorization.split(' ')[1];
    var data = jsonwebtoken_1.verify(token, process.env.JWT_SECRET);
    var password = data.password;
    var id = data;
    var db = new Database_1.Database();
    data_1.getUser(db, id)
        .then(function (result) {
        if (result.length < 1) {
            res.status(403);
            res.send({ message: "You need to be authenticated in order to perform this request" });
        }
        else {
            bcrypt_1.compare(password, result[0].password)
                .then(function (passwordMatches) {
                if (passwordMatches) {
                    req.body.userId = result[0].id;
                    next();
                }
                else {
                    res.status(403);
                    res.send({ message: "Incorrect password" });
                }
            });
        }
    })["catch"](function (err) {
        res.status(500);
        res.send({ message: "An unexpected error has occured" });
    })["finally"](function () {
        db.close();
    });
}
exports.authorize = authorize;
//# sourceMappingURL=authorize.js.map