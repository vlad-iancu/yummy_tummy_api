import * as express from 'express'
import { authorize } from '../auth/authorize'
import { getRestaurant, getRestaurants } from './data'
import { Database } from '../data/Database'
import { auth } from 'firebase-admin'

const router = express.Router()
interface SearchQuery {
    q?: string,
    page?: number,
    pageSize?: number
}
export { SearchQuery }

router.get("/restaurants", authorize, (req, res) => {
    let db = new Database()
    let q = req.query.q?.toString() ?? ""
    let page: number = parseInt(req.query.page?.toString() ?? "1")
    let pageSize: number = parseInt(req.query.pageSize?.toString() ?? "2")

    getRestaurants(db, { q, page, pageSize })
        .then(result => {
            res.send({ message: "ok", restaurants: result })
        })
        .catch(() => {
            res.status(500)
            res.send({ message: "Could not connect to the database" })
        })
        .finally(() => {
            db.close()
        })
})

router.get("/restaurant", authorize, (req, res) => {
    let db = new Database()
    let { id } = req.body
    getRestaurant(db, id)
    .then((restaurant) => {
        res.send({restaurant})
    })
})

export { router as restaurantsRouter }