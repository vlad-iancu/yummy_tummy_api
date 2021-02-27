import * as request from 'supertest'
import app from '../src/index'
import { Database } from '../src/data/Database'
import * as bcrypt from 'bcrypt'
import * as shell from 'shelljs'
import * as jwt from 'jsonwebtoken'
import { generateRandomString, getUnixTime, insertSampleUser } from './TestUtils'
describe("Validate User", () => {
    it("Validate an existing non-validated email", async (done) => {
        let user = await insertSampleUser({ present: true, validated: false }, { present: false, validated: false })
        console.log(user)
        let code = user.emailCode
        let res = await request(app)
            .post("/validate_user")
            .query({
                emailCode: code
            })
        let db = new Database()
        let dbCode = (await db.query(
            "SELECT * FROM user_validation WHERE code = ?",
            [code]
        ))[0]
        let dbUser = (await db.query(
            "SELECT * FROM user WHERE id = ?",
            [user.id]
        ))[0]

        await db.close()
        expect(dbCode).toBeFalsy()
        expect(res.status).toBe(200)
        expect(dbUser.emailCode).toBeFalsy()

        done()
    })
    it("Validate an existing non-validated phone", async (done) => {
        let user = await insertSampleUser({ present: false, validated: false }, { present: true, validated: false })
        console.log(user)
        let code = user.phoneCode
        let res = await request(app)
            .post("/validate_user")
            .query({
                phoneCode: code
            })
        let db = new Database()
        let dbCode = (await db.query(
            "SELECT * FROM user_validation WHERE code = ?",
            [code]
        ))[0]
        let dbUser = (await db.query(
            "SELECT * FROM user WHERE id = ?",
            [user.id]
        ))[0]

        await db.close()
        expect(res.status).toBe(200)
        expect(dbCode).toBeFalsy()
        expect(dbUser.phoneCode).toBeFalsy()

        done()
    })
    it("Validate a non-existing user email", async (done) => {
        let code = generateRandomString(6)
        let res = await request(app)
            .post("/validate_user")
            .query({
                emailCode: code
            })

        let db = new Database()
        let dbCode = (await db.query(
            "SELECT * FROM user_validation WHERE code = ?",
            [code]
        ))[0]
        await db.close()
        expect(res.status).toBe(400)
        expect(res.body).toHaveProperty("message")
        expect(dbCode).toBeFalsy()

        done()
    })
    it("Validate an already validated email", async (done) => {
        let user = await insertSampleUser({ present: true, validated: true }, { present: false, validated: false })
        let res = await request(app)
            .post("/validate_user")
            .send({
                emailCode: generateRandomString(6)
            })
        expect(res.status).toBe(400)
        done()
    })
    it("Validate a non-existing user phone", async (done) => {
        let code = generateRandomString(6)
        let res = await request(app)
            .post("/validate_user")
            .query({
                id: 0,
                phoneCode: code
            })

        let db = new Database()
        let dbCode = (await db.query(
            "SELECT * FROM user_validation WHERE code = ?",
            [code]
        ))[0]
        await db.close()

        expect(res.status).toBe(400)
        expect(res.body).toHaveProperty("message")
        expect(dbCode).toBeFalsy()

        done()
    })
    it("Validate an existing phone but non-existing email", async (done) => {
        let user = await insertSampleUser({ present: false, validated: false }, { present: true, validated: false })
        let res = await request(app)
            .post("/validate_user")
            .query({
                id: user.id,
                phoneCode: user.phoneCode,
                emailCode: "ABCDEF",
            })
        let db = new Database()
        let dbUser = (await db.query("SELECT * FROM user WHERE id = ?", [user.id]))[0]
        let dbCode = (await db.query("SELECT * FROM user_validation WHERE code = ?", [user.phoneCode]))[0]
        await db.close()

        expect(dbCode).toBeTruthy()
        expect(dbUser).not.toBeNull()
        expect(dbUser).toHaveProperty("phoneCode")
        expect(dbUser.emailCode).toBeFalsy()
        expect(res.status).toBe(400)
        done()
    })
    it("Validate an existing email but a non-existing phone", async (done) => {
        let user = await insertSampleUser({ present: true, validated: false }, { present: false, validated: false })
        let res = await request(app)
            .post("/validate_user")
            .query({
                id: user.id,
                phoneCode: "ABCDEF",
                emailCode: user.emailCode,
            })
        let db = new Database()
        let dbUser = (await db.query("SELECT * FROM user WHERE id = ?", [user.id]))[0]
        let dbCode = (await db.query("SELECT * FROM user_validation WHERE code = ?", [user.emailCode]))[0]
        await db.close()

        expect(dbCode).toBeTruthy()
        expect(dbUser).not.toBeNull()
        expect(dbUser.phoneCode).toBeFalsy()
        expect(dbUser).toHaveProperty("emailCode")
        expect(res.status).toBe(400)
        done()
    })
    it("Validate an existing email and phone", async (done) => {
        let user = await insertSampleUser({ present: true, validated: false }, { present: true, validated: false })
        let res = await request(app)
            .post("/validate_user")
            .query({
                phoneCode: user.phoneCode,
                emailCode: user.emailCode
            })
        let db = new Database()
        let dbUser = (await db.query("SELECT * FROM user WHERE id = ?", [user.id]))[0]
        let dbCode = (await db.query("SELECT * FROM user_validation WHERE code = ? OR code = ?", [user.emailCode, user.phoneCode]))[0]
        await db.close()

        expect(dbCode).toBeFalsy()
        expect(dbUser).not.toBeNull()
        expect(dbUser.phoneCode).toBeFalsy()
        expect(dbUser.emailCode).toBeFalsy()
        expect(res.status).toBe(200)
        done()
    })
    it("Validate an email of one user and the phone of another user", (done) => {
        done()
    })
    beforeAll(() => {
        shell.exec("bash ./clear_test_db.sh", { silent: true })
    })
    afterEach(() => {
        shell.exec("bash ./clear_test_db.sh", { silent: true })
    })
    afterAll(() => {
        shell.exec("bash ./clear_test_db.sh", { silent: true })
    })
})

