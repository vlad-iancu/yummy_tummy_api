import * as express from 'express'
import { Database } from '../data/Database'
import { getUser } from './data';
import { verify } from 'jsonwebtoken'
import { UserIdentifier } from './data'
import { compare } from 'bcrypt'
function authorize(req: express.Request, res: express.Response, next: express.NextFunction) {
    let token = req.headers.authorization.split(' ')[1]
    let data = verify(token, process.env.JWT_SECRET) as any
    let password: string = data.password;
    let id = data as UserIdentifier;

    let db = new Database();
    getUser(db, id)
        .then((result) => {
            if (result.length < 1) {
                res.status(403)
                res.send({ message: "You need to be authenticated in order to perform this request" })
            }
            else {
                compare(password, result[0].password)
                    .then(passwordMatches => {
                        if (passwordMatches) {
                            req.body.userId = result[0].id
                            next()
                        }
                        else {
                            res.status(403)
                            res.send({ message: "Incorrect password" })
                        }
                    })
            }
        })
        .catch((err) => {
            res.status(500)
            res.send({ message: "An unexpected error has occured" })
        })
        .finally(() => {
            db.close();
        })
}

export { authorize }