import { restaurantRouter } from "./restaurants"
import { authRouter } from './auth'
import * as express from 'express'
import {createValidator, specs} from './validate'
import * as fileUpload from 'express-fileupload'

let bodyParser = require('body-parser')
let https = require('https')
let app = express()

let ssl = require('../ssl')
let files = require('fs')
let path = require('path')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded())
app.use(fileUpload())
app.use(createValidator(specs))

app.use(authRouter);
app.use(restaurantRouter)
app.use(function (err, req: express.Request, res: express.Response, next: express.NextFunction) {
    if (err instanceof SyntaxError) {
        err = true;
        res.status(400);
        res.send({ message: "Malformed input, request is not a valid JSON" });
        return
    } else {
        res.status(500)
        res.send({message: "An unexpected error has occured"})
    }
})

https.createServer(ssl.credentials, app).listen(process.env.PORT, () => {
    console.log(`App listening on https://localhost:${process.env.PORT}`);
})