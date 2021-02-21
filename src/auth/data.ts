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
    email?: string,
    photoPath?: string
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
    message: string = "Could not find any user with the provided credentials"): Promise<User> {
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
    user.password = undefined
    return user

}
async function getUserProfile(
    db: Database,
    { email, phone, password }: UserIdentifier,
    message: string = "Could not find any user with the provided credentials"): Promise<User & { photoUrl: string }> {
    let user = await getUser(db, { email, phone, password }, message)
    console.log(user.photoPath)
    let photoUrl: string = "";
    if (user.photoPath)
        photoUrl = (await firebaseApp.storage().bucket()
            .file(user.photoPath).getSignedUrl({
                action: "read",
                expires: "03-09-2491"
            }))[0]
    return { photoUrl, ...user }
}

async function isDuplicateUser(db: Database, { email, phone }: Omit<UserIdentifier, "password">) {
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
async function updateUserProfile(db: Database, id: number, name?: string, file?: UploadedFile) {
    let promises: Array<Promise<any>> = []
    let user = (await db.query("SELECT * FROM user where id = ?", [id]))[0]
    if (file) {
        let extension = (file.mimetype.match(/(png)|(jpe?g)/))[0]
        let photoPath = `userProfile_${id}.${extension}`
        if (user.photoPath)
            promises.push(
                firebaseApp.storage().bucket()
                    .file(user.photoPath)
                    .delete({ ignoreNotFound: true })
            )

        promises.push(
            firebaseApp.storage().bucket()
                .file(photoPath)
                .save(file.data)
        )
        promises.push(db.query("UPDATE user SET photoPath = ? where id = ?",
            [photoPath, id]))
    }
    if (name) {
        promises.push(db.query("UPDATE user SET name = ? where id = ?",
            [name, id]))
    }
    return Promise.all(promises)
}
async function addUser(db: Database, { name, password, email, phone }: UserAttributes): Promise<User> {
    let result = await db.query("INSERT INTO user(name, password, email, phone) VALUES(?,?,?,?)",
        [name, password, email, phone])
    if (!result.insertId) throw "Could not insert the user"
    return { name, email, phone, id: result.insertId }
}
async function deleteProfilePicture(db: Database, photoPath: string): Promise<any> {
    let promises: Array<Promise<any>> = []
    if (photoPath)
        promises.push(
            firebaseApp.storage()
                .bucket()
                .file(photoPath)
                .delete({ ignoreNotFound: false })
        )
    promises.push(db.query("UPDATE user SET photoPath = null WHERE photoPath = ?", [photoPath]))
    return Promise.all(promises)
}
export { getUser, isDuplicateUser, updateUser, updateUserProfile, addUser, getUserProfile, deleteProfilePicture }
export type { UserIdentifier, UserAuthentication }