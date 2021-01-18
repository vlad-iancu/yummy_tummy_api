let express = require('express')
let Database = require('../data/Database').Database
let bodyParser = require('body-parser')
let bcrypt = require('bcrypt')
let validation = require('../../validate')
let files = require('fs')
let path = require('path')
let jwt = require('jsonwebtoken')
let { getUser } = require('./data')
const usersRouter = express.Router();

usersRouter.use(bodyParser.json())
console.log(__dirname)

let validator = validation.createValidator(validation.specs)
usersRouter.use(validator)

usersRouter.post("/register", (req, res) => {
    let { name, email, phone, password } = req.body
    if (email == null && phone == null) {
        res.status(400);
        res.send({
            message: "You need to provide an email or a phone number"
        });
        res.send();
        return;
    }
    password = bcrypt.hashSync(password, 10)
    let db = new Database();
    db.query("INSERT INTO user(name, password, email, phone) VALUES(?,?,?,?)", [name, password, email, phone])
        .then(result => {
            res.send({ name, email, phone, id: result.insertId })
        })
        .catch(err => {
            res.status(400);
            res.send(err)
        })
        .finally(() => {
            db.close()
        })
})

usersRouter.post("/login", (req, res) => {
    let { email, phone, password } = req.body;
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

usersRouter.get("/user", (req, res) => {

})

usersRouter.delete("/user", (req, res) => {

})


function authorize(req, res, next) {

}




module.exports.usersRouter = usersRouter
module.exports.authorize = authorize