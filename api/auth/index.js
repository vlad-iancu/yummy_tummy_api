let express = require('express')
var authRouter = express.Router();
let usersRouter = require('./users').usersRouter

authRouter.use(usersRouter)
authRouter.use(function (err, req, res, next) {
    if (err instanceof SyntaxError) {
        error = true;
        res.status(400);
        res.send({ message: "Malformed input, request is not a valid JSON" });
        return
    } else
        next();
})

module.exports.authRouter = authRouter

