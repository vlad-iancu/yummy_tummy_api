import * as express from 'express'
import { Database } from '../data/Database'
import { authorize } from './authorize'
import * as bcrypt from 'bcrypt'
import * as jwt from 'jsonwebtoken'
import { addUser, getUser, isDuplicateUser, updateUserProfile } from './data'
import { UploadedFile } from 'express-fileupload'

const router = express.Router();

type RegisterRequest = {
    name: string,
    email?: string,
    phone?: string,
    password: string
}
router.post("/register", (req: express.Request, res: express.Response) => {
    let { name, email, phone, password } = req.body;
    if (!email && !phone) {
        res.status(400);
        res.send({
            message: "You need to provide an email or a phone number"
        });
        res.send();
        return;
    }
    password = bcrypt.hashSync(password, 10);
    let db = new Database();
    isDuplicateUser(db, { email, phone })
        .then(result => {
            if (result.phoneDuplicate || result.emailDuplicate) {
                res.status(400);
                let email = result.emailDuplicate ? "email" : "";
                let phone = result.phoneDuplicate ? "phone" : "";
                let and = result.phoneDuplicate && result.emailDuplicate ? " and " : "";
                res.send({ message: `There is another user with the same ${email}${and}${phone}` })
            }
        })
    addUser(db, { name, password, email, phone })
        .then(user => {
            res.send(user)
        })
        .catch(err => {
            let statusCode = typeof err === "string" ? 400 : 500
            res.status(statusCode).send({ message: err })
        })
        .finally(() => {
            db.close()
        })
})
type LoginRequest = {
    email?: string,
    phone?: string,
    password: string
}

router.post("/login", (req: express.Request, res: express.Response) => {
    let { email, phone, password }: LoginRequest = req.body;
    if (email == null && phone == null) {
        res.status(400);
        res.send({
            message: "You need to provide an email or a phone number"
        });
    }
    let db = new Database();

    getUser(db, { email, phone, password })
        .then(() => {
            const token = jwt.sign({ email, phone, password }, process.env.JWT_SECRET)
            res.send({ token });
        })
        .catch(err => {
            res.status(400)
            res.send({ message: err })
        })
        .finally(() => {
            db.close();
        })
})

router.get("/user", authorize, (req: express.Request, res: express.Response) => {
    res.send(req.body.user)
})

type ProfileRequest = RegisterRequest
router.put("/user_profile", (req: express.Request, res: express.Response) => {
    let file: UploadedFile = req.files.profilePicture as UploadedFile
    let { name, email, phone, password }: ProfileRequest = req.body
    let db = new Database()
    getUser(db, { email, phone, password })
        .then(async result => {
            let id = result.id
            return updateUserProfile(db, id, name, file)
        })
        .then(() => {
            res.send({ message: "User profile updated" })
        })
        .catch(err => {
            let statusCode = typeof err === "string" ? 400 : 500
            res.status(statusCode).send({ message: err })
        })
        .finally(() => {
            db.close()
        })
})

export { router as usersRouter }