import { compare, hash } from "bcrypt";
import { UploadedFile } from "express-fileupload";
import { Database } from "../data/Database";
import { firebaseApp } from '../Firebase'
/* import * as sendgrid from '@sendgrid/mail'
import { send } from "@sendgrid/mail"; */
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
    validate: boolean = false): Promise<User> {
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
        if (user.phoneCode != null && phone)
            throw "We have sent you an SMS message with the code to this phone number, enter the code in the app"
        if (user.emailCode != null && email)
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

/* async function sendEmail(to: string, text: string) {
    if (process.env.NODE_ENV != "test") {
        sendgrid.setApiKey(process.env.SENDGRID_API_KEY)
        const message = {
            to,
            from: "iancuvladalexandru@gmail.com",
            subject: "Hello Sendgrid",
            text,
        }
        return sendgrid.send(message)
    }
     return Promise.resolve()
}*/
async function getUserById(db: Database, id: number): Promise<User> {
    let dbPromise = db.query("SELECT * FROM user WHERE id = ?", [id])
    let user = (await dbPromise)[0]
    if (!user) {
        throw "User does not exist"
    }
    return await user
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
    password = await hash(password, 10)
    if (!phone) phone = null
    if (!email) email = null
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
async function getUserThatHasValidationCodes(db: Database, emailCode?: string, phoneCode?: string): Promise<User> {
    let time = getUnixTime()
    if (emailCode)
        if (phoneCode) {
            let user = (await db.query("SELECT * FROM user WHERE emailCode = ? AND phoneCode = ?", [emailCode, phoneCode]))[0]
            if (!user) throw "There is no user that has these verification codes, make sure they are both correct"
            let emailCodeValid = (await db.query("SELECT * FROM user_validation WHERE code = ? AND expiration > ?", [emailCode, time]))[0]
            if (!emailCodeValid) throw "The email code has expired, request a new one"
            let phoneCodeValid = (await db.query("SELECT * FROM user_validation WHERE code = ? AND expiration > ?", [phoneCode, time]))[0]
            if (!phoneCodeValid) throw "The phone code has expired, request a new one"
            return user;
        }
        else {
            let user = (await db.query("SELECT * FROM user WHERE emailCode = ?", [emailCode]))[0]
            if (!user) throw "There is no user that has this email code, make sure it is correct"
            let emailCodeValid = (await db.query("SELECT * FROM user_validation WHERE code = ? AND expiration > ?", [emailCode, time]))[0]
            if (!emailCodeValid) throw "The email code has expired, request a new one"
            return user;
        }
    else {
        if (phoneCode) {
            let user = (await db.query("SELECT * FROM user WHERE phoneCode = ?", [phoneCode]))[0]
            if (!user) throw "There is no user that has this phone code, make sure it is correct"
            let phoneCodeValid = (await db.query("SELECT * FROM user_validation WHERE code = ? AND expiration > ?", [phoneCode, time]))[0]
            if (!phoneCodeValid) throw "The phone code has expired, request a new one"
            return user;
        }
        else
            throw "You need to provide an email code or a phone code"
    }

}
async function validateUserCodes(db: Database, emailCode?: string, phoneCode?: string) {
    let user = await getUserThatHasValidationCodes(db, emailCode, phoneCode)
    if (emailCode) {
        await db.query("UPDATE user SET emailCode = null WHERE emailCode = ?", [emailCode])
        await db.query("DELETE FROM user_validation WHERE code = ?", [emailCode])
    }
    if (phoneCode) {
        await db.query("UPDATE user SET phoneCode = null WHERE phoneCode = ?", [phoneCode])
        await db.query("DELETE FROM user_validation WHERE code = ?", [phoneCode])
    }

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
    validateUserCodes,
    getUserThatHasValidationCodes,
}
export type { UserIdentifier, UserAuthentication }