
import * as express from 'express'
import {Database} from '../data/Database'
let bodyParser = require('body-parser')
let bcrypt = require('bcrypt')
let validation = require('../validate')
let files = require('fs')
let path = require('path')
let jwt = require('jsonwebtoken')

import { getUser, isDuplicateUser } from './data'
const usersRouter = express.Router();

usersRouter.use(bodyParser.json())
console.log(__dirname)

let validator = validation.createValidator(validation.specs)
usersRouter.use(validator)

type RegisterRequest = {
    name: string,
    email?: string,
    phone?: string,
    password: string
}
type LoginRequest = {
    email?: string,
    phone?: string,
    password: string
}
usersRouter.post("/register", (req: express.Request, res: express.Response) => {
    
    let { name, email, phone, password }: RegisterRequest = req.body
    if (!email && !phone) {
        res.status(400);
        res.send({
            message: "You need to provide an email or a phone number"
        });
        res.send();
        return;
    }
    password = bcrypt.hashSync(password, 10)
    let db = new Database();
    isDuplicateUser(db, { email, phone })
        .then(result => {
            if (result.phoneDuplicate || result.emailDuplicate) {
                res.status(400);
                let email = result.emailDuplicate ? "email" : "";
                let phone = result.phoneDuplicate ? "phone" : "";
                let and = result.phoneDuplicate && result.emailDuplicate ? " and " : "";
                res.send({ message: `There is another user with the same ${email}${and}${phone}` })
            }
        })
    db.query("INSERT INTO user(name, password, email, phone) VALUES(?,?,?,?)", [name, password, email, phone])
        .then(result => {
            res.send({ name, email, phone, id: result.insertId })
        })
        .catch(err => {
            res.status(400);
        })
        .finally(() => {
            db.close().catch((err) => { });
        })
})

usersRouter.post("/login", (req: express.Request, res: express.Response) => {
    let { email, phone, password }: LoginRequest = req.body;
    if (email == null && phone == null) {
        res.status(400);
        res.send({
            message: "You need to provide an email or a phone number"
        });
    }
    let db = new Database();

    getUser(db, { email, phone })
        .then(result => {
            if (result.length != 1) {
                res.status(400)
                res.send({ message: "Cannot find any user with provided credentials" })
                return
            }
            if (bcrypt.compareSync(password, result[0].password)) {
                const token = jwt.sign({ email, phone, password }, process.env.JWT_SECRET)
                res.send({ token });
            }
            else {
                res.status(401)
                res.send({ message: "Incorrect password" })
            }
        })
        .catch(err => {
            res.status(400)
            res.send(err)
        })
        .finally(() => {
            db.close();
        })
})

usersRouter.get("/user", (req: express.Request, res: express.Response) => {

})

usersRouter.delete("/user", (req: express.Request, res: express.Response) => {

})


function authorize(req, res, next) {

}

export {authorize, usersRouter}