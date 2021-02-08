"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
exports.__esModule = true;
exports.restaurantsRouter = void 0;
var express = require("express");
var authorize_1 = require("../auth/authorize");
var body_parser_1 = require("body-parser");
var data_1 = require("./data");
var Database_1 = require("../data/Database");
var router = express.Router();
exports.restaurantsRouter = router;
router.get("/restaurants", body_parser_1.urlencoded({ extended: false }), authorize_1.authorize, function (req, res) {
    var _a, _b, _c, _d, _e, _f;
    var db = new Database_1.Database();
    var q = (_b = (_a = req.query.q) === null || _a === void 0 ? void 0 : _a.toString()) !== null && _b !== void 0 ? _b : "";
    var page = parseInt((_d = (_c = req.query.page) === null || _c === void 0 ? void 0 : _c.toString()) !== null && _d !== void 0 ? _d : "1");
    var pageSize = parseInt((_f = (_e = req.query.pageSize) === null || _e === void 0 ? void 0 : _e.toString()) !== null && _f !== void 0 ? _f : "2");
    data_1.getRestaurants(db, { q: q, page: page, pageSize: pageSize })
        .then(function (result) {
        res.send({ message: "ok", restaurants: result.map(function (_a) {
                var relevance = _a.relevance, obj = __rest(_a, ["relevance"]);
                return obj;
            }) });
    })["catch"](function (err) {
        res.status(500);
        res.send({ message: "Could not connect to the database" });
    })["finally"](function () {
        db.close();
    });
});
//# sourceMappingURL=restaurants.js.map