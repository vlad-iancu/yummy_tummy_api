import * as request from 'supertest'
import app from '../src/index'
import { Database } from '../src/data/Database'
import * as bcrypt from 'bcrypt'
import * as shell from 'shelljs'

export function runRegisterTests() {
    describe("Register", () => {
        it("Register user with valid email and no phone", async (done) => {
            const res = await request(app)
                .post("/register")
                .send({
                    name: "TestUser",
                    email: "email@test.com",
                    password: "parola"
                })

            expect(res.body).toHaveProperty("id")
            expect(res.body).toHaveProperty("name")
            expect(res.body).toHaveProperty("email")
            expect(res.body.email).toBe("email@test.com")
            expect(res.body.name).toBe("TestUser")
            expect(typeof res.body.id).toBe('number')
            expect(typeof res.body.name).toBe('string')
            expect(typeof res.body.email).toBe('string')
            let db = new Database()
            let dbUser = (await db.query("SELECT * FROM user WHERE id = ?", [res.body.id]))[0]
            let isValid = await bcrypt.compare("parola", dbUser.password);
            await db.close()
            expect(isValid).toBe(true)

            done()
        })
        it("Register user with no email and valid phone", async (done) => {
            const res = await request(app)
                .post("/register")
                .send({
                    name: "TestUser",
                    phone: "0721711423",
                    password: "parola"
                })

            expect(res.body).toHaveProperty("id")
            expect(res.body).toHaveProperty("name")
            expect(res.body).toHaveProperty("phone")
            expect(res.body.phone).toBe("0721711423")
            expect(res.body.name).toBe("TestUser")
            expect(typeof res.body.id).toBe('number')
            expect(typeof res.body.id).toBe('number')
            expect(typeof res.body.name).toBe('string')

            let db = new Database()
            let dbUser = (await db.query("SELECT * FROM user WHERE id = ?", [res.body.id]))[0]
            let isValid = await bcrypt.compare("parola", dbUser.password);
            await db.close()
            expect(isValid).toBe(true)

            done()
        })
        it("Register user with no email and no phone", async (done) => {
            const res = await request(app)
                .post("/register")
                .send({ name: "TestName", password: "parola" })
            expect(res.status).toBe(400)
            expect(res.body).toHaveProperty("message")
            done()
        })
        it("Register with no name and valid phone and email", async (done) => {
            const res = await request(app)
                .post("/register")
                .send({ phone: "0721711423", password: "parola", email: "test@email.com" })
            expect(res.status).toBe(400)
            expect(res.body).toHaveProperty("message")
            done()
        })
        it("Register with no password", async (done) => {
            const res = await request(app)
                .post("/register")
                .send({ phone: "0721711423", email: "test@email.com" })
            expect(res.status).toBe(400)
            expect(res.body).toHaveProperty("message")
            done()
        })
        it("Register with valid email, phone and name", async (done) => {
            const res = await request(app)
                .post("/register")
                .send({ name: "TestName", phone: "0721711423", password: "parola", email: "test@email.com" })

            expect(res.status).toBe(200)
            expect(res.body).toHaveProperty("name")
            expect(res.body).toHaveProperty("id")
            expect(res.body).toHaveProperty("phone")
            expect(res.body).toHaveProperty("email")

            expect(res.body.email).toBe("test@email.com")
            expect(res.body.name).toBe("TestName")
            expect(res.body.phone).toBe("0721711423")

            expect(typeof res.body.id).toBe("number")

            let db = new Database()
            let dbUser = (await db.query("SELECT * FROM user WHERE id = ?", [res.body.id]))[0]
            let isValid = await bcrypt.compare("parola", dbUser.password);
            await db.close()
            expect(isValid).toBe(true)
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
}



/* test("Register user with invalid email", async (done) => {
    const res = await request(app)
}) */
