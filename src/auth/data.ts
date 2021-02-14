import { compare } from "bcrypt";
import { UploadedFile } from "express-fileupload";
import { type } from "os";
import { Database } from "../data/Database";
import { firebaseApp } from '../Firebase'
type UserIdentifier = {
    email?: string,
    phone?: string,
    password: string
}

type UserAuthentication = UserIdentifier & { password: string }
interface User {
    id: number,
    name: string,
    phone?: string
    email?: string
}
type UserAttributes = {
    name: string,
    email?: string,
    phone?: string,
    password?: string
}
async function getUser(
    db: Database, 
    { email, phone, password }: UserIdentifier,
    message: string = "Could not find any user with the provided credentials" ): Promise<User> {
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
    let user = (await dbPromise)[0]
    if (!user)
        throw message
    let match = await compare(password, user.password)
    if (!match)
        throw "Incorrect Password"

    return user

}

async function isDuplicateUser(db: Database, { email, phone }: Omit<UserIdentifier,"password"> ) {
    return db.query("SELECT email, phone from user WHERE (email = ? OR phone = ?)", [email, phone])
        .then(result => {
            return {
                phoneDuplicate: result[0] != null && result[0].phone === phone,
                emailDuplicate: result[0] != null && result[0].email === email,
            }
        })
}
async function updateUser(db: Database, id: number, name: string) {
    return db.query("UPDATE user SET name = ? where id = ?", [name, id])
}
async function updateUserProfile(db: Database, id: number, name: string, file: UploadedFile) {
    let extension = (file.mimetype.match(/(png)|(jpe?g)/))[0]
    let promises: Array<Promise<any>> = []
    promises.push(
        firebaseApp.storage().bucket()
            .file(`userProfile_id${id}.${extension}`)
            .save(file.data)
    )
    promises.push(db.query("UPDATE user SET name = ? where id = ?", [name, id]))
    return Promise.all(promises)
}
async function addUser(db: Database, {name, password, email, phone}: UserAttributes): Promise<User> {
    let result = await db.query("INSERT INTO user(name, password, email, phone) VALUES(?,?,?,?)", 
    [name, password, email, phone])
    if(!result.insertId) throw "Could not insert the user"
    return {name, email, phone, id: result.insertId}
}
export { getUser, isDuplicateUser, updateUser, updateUserProfile, addUser }
export type { UserIdentifier, UserAuthentication }