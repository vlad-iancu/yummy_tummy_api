"use strict";
exports.__esModule = true;
exports.restaurantRouter = void 0;
var express = require("express");
var restaurants_1 = require("./restaurants");
var restaurantRouter = express.Router();
exports.restaurantRouter = restaurantRouter;
restaurantRouter.use(restaurants_1.restaurantsRouter);
restaurantRouter.use(function (err, req, res, next) {
    if (err instanceof SyntaxError) {
        err = true;
        res.status(400);
        res.send({ message: "Malformed input, request is not a valid JSON" });
        return;
    }
    else
        next();
});
//# sourceMappingURL=index.js.map