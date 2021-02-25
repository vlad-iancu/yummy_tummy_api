import { compare } from "bcrypt";
import { time, timeStamp } from "console";
import { UploadedFile } from "express-fileupload";
import { networkInterfaces, type } from "os";
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
    photoPath?: string,
    phoneCode?: string,
    emailCode?: string
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
    message: string = "Could not find any user with the provided credentials",
    validate: boolean = true): Promise<User> {
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

    if (validate) {
        if (user.phoneCode != null)
            throw "We have sent you an SMS message with the code to this phone number, enter the code in the app"
        if (user.emailCode != null)
            throw "We have send you an email with the code to this email addess, enter the code in the app"
    }

    let match = await compare(password, user.password)
    if (!match)
        throw "Incorrect Password"

    user.password = undefined
    user.phoneCode = undefined
    user.emailCode = undefined
    return user

}
async function getUserById(db: Database, id: number): Promise<User> {
    let dbPromise = db.query("SELECT * FROM user WHERE id = ?", [id])
    let user = (await dbPromise)[0]
    if (!user) {
        throw "User does not exist"
    }
    return await user
}
type ValidateParams = { id: number, phoneCode?: string, emailCode?: string }
async function validateUser(db: Database, { id, phoneCode, emailCode }: ValidateParams): Promise<any> {
    if (phoneCode) {
        let code = (await db.query("SELECT * FROM user_validation WHERE code = ?", [phoneCode]))[0]
        if(!code) throw "The code is incorrect, try again"
        if (code.expiration < getUnixTime())
            throw "Phone code has expired"
        await db.query("UPDATE user SET phoneCode = ? WHERE id = ? AND phoneCode = ?", [null, id, phoneCode.toUpperCase()])
        await db.query("DELETE FROM user_validation WHERE code = ?", [phoneCode])
    }
    if (emailCode) {
        let code = (await db.query("SELECT * FROM user_validation WHERE code = ?", [emailCode]))[0]
        if (!code) throw "The code is incorrect, try again"
        if (code.expiration < getUnixTime())
            throw "Phone code has expired"
        await db.query("UPDATE user SET emailCode = ? WHERE id = ? AND emailCode = ?", [null, id, emailCode.toUpperCase()])
        await db.query("DELETE FROM user_validation WHERE code = ?", [emailCode])
    }

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
        let photoPath = `profile/user_${id}.${extension}`
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
    let phoneCode = generateVerificationCode().toUpperCase()
    let emailCode = generateVerificationCode().toUpperCase()
    let expiration = getUnixTime() + 3600
    if (phone) {
        await db.query("INSERT INTO user_validation(code, expiration) values(?,?)", [phoneCode, expiration])
        await db.query("UPDATE user SET phoneCode = ? WHERE id = ?", [phoneCode, result.insertId])
    }
    if (email) {
        await db.query("INSERT INTO user_validation(code, expiration) values(?,?)", [emailCode, expiration])
        await db.query("UPDATE user SET emailCode = ? WHERE id = ?", [emailCode, result.insertId])
    }

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
function generateVerificationCode(): string {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 6; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}
function getUnixTime(): number {
    return (Date.now() / 1000) | 0;
}

export {
    getUser,
    isDuplicateUser,
    updateUser,
    updateUserProfile,
    addUser,
    getUserProfile,
    deleteProfilePicture,
    getUserById,
    validateUser
}
export type { UserIdentifier, UserAuthentication }