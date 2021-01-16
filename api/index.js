let express = require('express')
let app = express()
let authRouter = require('./auth').authRouter
/* app.get("/all_users", (req, res) => {
    let db = new Database()
    db.query("SELECT * FROM user")
    .then(rows => {
        res.send(JSON.stringify(rows))
        db.close()
        console.log("Database closed")
    })
}) */
app.use(authRouter);

app.listen(process.env.PORT, () => {
    console.log("App listening on http://localhost");
})