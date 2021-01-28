
async function getUser(db, { email, phone }) {
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

async function isDuplicateUser(db, { email, phone }) {
    let dbPromise = null
    return db.query("SELECT email, phone from user WHERE (email = ? OR phone = ?)", [email, phone])
        .then(result => {
            return {
                phoneDuplicate: result[0] != null && result[0].phone === phone,
                emailDuplicate: result[0] != null && result[0].email === email,
            }
        })
}
module.exports.getUser = getUser
module.exports.isDuplicateUser = isDuplicateUser