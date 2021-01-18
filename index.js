let express = require('express')
let https = require('https')
let app = express()
let authRouter = require('./api/auth').authRouter
let files = require('fs')
let path = require('path')
app.use(authRouter);

https.createServer({
    key: files.readFileSync('server.key'),
    cert: files.readFileSync('server.cert')
}, app).listen(process.env.PORT, () => {
    console.log("App listening on http://localhost");
})