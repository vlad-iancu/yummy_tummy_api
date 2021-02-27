import { Database } from "../src/data/Database";
import * as bcrypt from 'bcrypt'
interface TestUser {
    id: number,
    name: string,
    email?: string,
    phone?: string,
    password: string
    emailCode?: string,
    phoneCode?: string,
    photoPath?: string,

}
interface CredentialConfig {
    present: boolean,
    validated: boolean
}
async function insertSampleUser(emailConfig: CredentialConfig, phoneConfig: CredentialConfig): Promise<TestUser> {
    let name = generateRandomString(10)
    let email = emailConfig.present ? `${generateRandomString(5)}@email.com` : null
    let phone = phoneConfig.present ? generateRandomPhoneNumber() : null
    let password = await bcrypt.hash("parola", 10)
    let emailCode = null
    let phoneCode = null
    let result: TestUser = { id: 0, name, email, phone, emailCode, phoneCode, password: "parola" }
    let db = new Database()
    if (email) {
        if (!emailConfig.validated) {
            emailCode = generateRandomString(6).toUpperCase()
            await db.query("INSERT INTO user_validation(code, expiration) values(?,?)", [emailCode, getUnixTime() + 3600])
        }
    } else {
        result.emailCode = undefined
        result.email = undefined
    }
    if (phone) {
        if (!phoneConfig.validated) {
            phoneCode = generateRandomString(6).toUpperCase()
            await db.query("INSERT INTO user_validation(code, expiration) values(?,?)", [phoneCode, getUnixTime() + 3600])
        }
    } else {
        result.phoneCode = undefined
        result.phone = undefined
    }
    let insertResult = await db.query(
        "INSERT INTO user(name, password, email, phone, phoneCode, emailCode) VALUES(?,?,?,?,?,?)",
        [name, password, email, phone, phoneCode, emailCode])
    result.id = insertResult.insertId
    return {...result,emailCode, phoneCode};
}



function generateRandomString(length: number): string {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < length; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}
function generateRandomPhoneNumber(): string {
    var text = "";
    var possible = "0123456789";

    for (var i = 0; i < 10; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}
function getUnixTime(): number {
    return (Date.now() / 1000) | 0;
}
export { getUnixTime, insertSampleUser, generateRandomString, generateRandomPhoneNumber }