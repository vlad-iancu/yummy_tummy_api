
function getUser(db, {email, phone}) {
    let dbPromise = null;
    if (email != null)
        if (phone != null) {
            dbPromise = db.query("SELECT * FROM user WHERE (email = ? AND phone = ?)",
                [email, phone]);
        }
        else {
            dbPromise = db.query("SELECT * FROM user WHERE email = ?", [email]);
        }
    else
        dbPromise = db.query("SELECT * FROM user WHERE phone = ?", [phone]);
    return dbPromise
}

module.exports.getUser = getUser