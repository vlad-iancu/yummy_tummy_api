import * as express from 'express'
import { authorize } from '../auth/authorize'
import { urlencoded } from 'body-parser'
import { getRestaurants } from './data'
import { Database } from '../data/Database'
import bodyParser = require('body-parser')
let validation = require('../validate')

const router = express.Router()
interface SearchQuery {
    q?: string,
    page?: number,
    pageSize?: number
}
export { SearchQuery }

let validator = validation.createValidator(validation.specs)
router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: false }))

router.get("/restaurants", validator, authorize, (req, res) => {
    let db = new Database()
    let q = req.query.q?.toString() ?? ""
    let page: number = parseInt(req.query.page?.toString() ?? "1")
    let pageSize: number = parseInt(req.query.pageSize?.toString() ?? "2")

    getRestaurants(db, { q, page, pageSize })
        .then(result => {
            res.send({ message: "ok", restaurants: result.map(({ relevance, ...obj }) => obj) })
        })
        .catch(err => {
            res.status(500)
            res.send({ message: "Could not connect to the database" })
        })
        .finally(() => {
            db.close()
        })
})

export { router as restaurantsRouter }