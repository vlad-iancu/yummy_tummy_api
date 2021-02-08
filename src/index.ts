import { restaurantRouter } from "./restaurants"
import { authRouter } from './auth'
let express = require('express')
let https = require('https')
let app = express()

let ssl = require('../ssl')
let files = require('fs')
let path = require('path')

app.use(authRouter);
app.use(restaurantRouter)

https.createServer(ssl.credentials, app).listen(process.env.PORT, () => {
    console.log("App listening on https://localhost");
})