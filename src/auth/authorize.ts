import * as express from 'express'
import { Database } from '../data/Database'
import { getUser } from './data';
import { verify } from 'jsonwebtoken'
import { UserIdentifier } from './data'
import { compare } from 'bcrypt'
function authorize(req: express.Request, res: express.Response, next: express.NextFunction) {
    let token = req.headers.authorization?.split(' ')[1]
    if(!token) {res.status(401); res.send({message: "No authorization token found"})}
    let data = verify(token, process.env.JWT_SECRET) as any
    let id = data as UserIdentifier;

    let db = new Database();
    getUser(db, id, "You need to be authenticated in order to perform this request")
        .then((result) => {
           req.body.user = result
           next()
        })
        .catch((err) => {
            let statusCode = typeof err === "string" ? 400 : 500
            res.status(statusCode).send({ message: err })
        })
        .finally(() => {
            db.close();
        })
}

export { authorize }