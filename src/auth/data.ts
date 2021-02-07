import { Database } from "../data/Database";
type UserIdentifier = {
    email? : string,
    phone? : string
}
async function getUser(db: Database, { email, phone }: UserIdentifier) {
    let dbPromise = null;
    if (email)
        if (phone) {
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

async function isDuplicateUser(db: Database, { email, phone }: UserIdentifier) {
    let dbPromise = null
    return db.query("SELECT email, phone from user WHERE (email = ? OR phone = ?)", [email, phone])
        .then(result => {
            return {
                phoneDuplicate: result[0] != null && result[0].phone === phone,
                emailDuplicate: result[0] != null && result[0].email === email,
            }
        })
}
export {getUser, isDuplicateUser}