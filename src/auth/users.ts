
import * as express from 'express'
import { app } from 'firebase-admin'
import { Database } from '../data/Database'
import { authorize } from './authorize'
let bodyParser = require('body-parser')
let bcrypt = require('bcrypt')
let validation = require('../validate')
let files = require('fs')
let path = require('path')
let jwt = require('jsonwebtoken')
let listEndpoints = require('express-list-endpoints')
import { getUser, isDuplicateUser } from './data'
const router = express.Router();
router.use(bodyParser.json())
router.use(bodyParser.urlencoded())

let validator = validation.createValidator(validation.specs)
//router.use(validator)
router.post('/sdfs', (req, res) => {

})
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
router.post("/register", (req: express.Request, res: express.Response) => {

        let { name, email, phone, password } = req.body;
        if (!email && !phone) {
            res.status(400);
            res.send({
                message: "You need to provide an email or a phone number"
            });
            res.send();
            return;
        }
        password = bcrypt.hashSync(password, 10);
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

router.post("/login", (req: express.Request, res: express.Response) => {
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

router.get("/user", authorize, (req: express.Request, res: express.Response) => {
    let db = new Database();
    res.send(req.body.user)
})

router.delete("/user", (req: express.Request, res: express.Response) => {

})

export { router as usersRouter }