let express = require('express')
let Database = require('../data/Database').Database
const usersRouter = express.Router();

usersRouter.get("/all_users", (req, res) => {
    let db = new Database()
    db.query("SELECT * FROM user")
    .then(rows => {
        res.send(JSON.stringify(rows))
        db.close()
        console.log("Database closed")
    })
})





module.exports.usersRouter = usersRouter