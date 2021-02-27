import * as request from 'supertest'
import app from '../src/index'
import { Database } from '../src/data/Database'
import * as bcrypt from 'bcrypt'
import * as shell from 'shelljs'
import * as jwt from 'jsonwebtoken'
import { getUnixTime, insertSampleUser } from './TestUtils'

describe("Login", () => {
    it("Login with a non validated email", async (done) => {
        let password = await bcrypt.hash("parola", 10)
        let email = "test@email.com"
        let emailCode = "ABCDEF"
        let name = "TestName"
        let db = new Database()
        let expiration = getUnixTime() + 3600
        await db.query("INSERT INTO user_validation(code, expiration) values(?, ?)", [emailCode, expiration])
        await db.query("INSERT INTO user(email, password, name, emailCode) values(?,?,?,?)", [email, password, name, emailCode])
        await db.close()
        let res = await request(app)
            .post("/login")
            .send({
                email: "test@email.com",
                password: "parola"
            })
        expect(res.status).toBe(400)
        expect(res.body).toHaveProperty("message")
        done()

    })
    it("Login with a non validated phone", async (done) => {

        let password = await bcrypt.hash("parola", 10)
        let phone = "0721711423"
        let phoneCode = "ABCDEF"
        let name = "TestName"
        let db = new Database()
        let expiration = getUnixTime() + 3600
        await db.query("INSERT INTO user_validation(code, expiration) values(?, ?)", [phoneCode, expiration])
        await db.query("INSERT INTO user(phone, password, name, phoneCode) values(?,?,?,?)", [phone, password, name, phoneCode])
        await db.close()

        let res = await request(app)
            .post("/login")
            .send({
                phone: "0721711423",
                password: "parola"
            })
        expect(res.status).toBe(400)
        expect(res.body).toHaveProperty("message")
        done()
    })
    it("Login with an incorrect password", async (done) => {

        let password = await bcrypt.hash("parola", 10)
        let phone = "0721711423"
        let email = "my@email.com"
        let name = "TestName"
        let db = new Database()
        await db.query("INSERT INTO user(email, phone, password, name) values(?,?,?,?)", [email, phone, password, name])
        await db.close()
        let res = await request(app)
            .post("/login")
            .send({
                phone: "0721711423",
                password: "nuparola"
            })
        expect(res.status).toBe(400)
        expect(res.body).toHaveProperty("message")
        done()
    })
    it("Login with a valid email and password", async (done) => {
        let user = await insertSampleUser({ present: true, validated: true }, { present: false, validated: false })
        let res = await request(app)
            .post("/login")
            .send({
                email: user.email,
                password: user.password
            })

        expect(res.body).toHaveProperty("token")
        let jwtData = jwt.verify(res.body.token, process.env.JWT_SECRET) as any
        expect(jwtData.email).toBe(user.email)
        expect(jwtData.password).toBe(user.password)

        done()
    })
    it("Login with a valid phone and password", async (done) => {
        let user = await insertSampleUser({ present: false, validated: false }, { present: true, validated: true })
        let res = await request(app)
            .post("/login")
            .send({
                phone: user.phone,
                password: user.password
            })

        expect(res.body).toHaveProperty("token")
        let jwtData = jwt.verify(res.body.token, process.env.JWT_SECRET) as any
        expect(jwtData.phone).toBe(user.phone)
        expect(jwtData.password).toBe(user.password)

        done()

    })
    it("Login with valid phone, email and password", async (done) => {
        let user = await insertSampleUser({ present: true, validated: true }, { present: true, validated: true })
        let res = await request(app)
            .post("/login")
            .send({
                email: user.email,
                phone: user.phone,
                password: user.password
            })

        expect(res.body).toHaveProperty("token")
        let jwtData = jwt.verify(res.body.token, process.env.JWT_SECRET) as any
        expect(jwtData.email).toBe(user.email)
        expect(jwtData.password).toBe(user.password)

        done()

    })
    it("Login with a valid email and incorrect phone", (done) => {
        done()
    })
    it("Login with a valid phone and incorrect email", (done) => {
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

