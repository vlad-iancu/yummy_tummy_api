let express = require('express')
var authRouter = express.Router();
let usersRouter = require('./users').usersRouter

authRouter.use(usersRouter)

module.exports.authRouter = authRouter

