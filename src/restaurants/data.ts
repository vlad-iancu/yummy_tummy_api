import { Database } from "../data/Database";
import { SearchQuery } from "./restaurants";

async function getRestaurants(db: Database, { q, page, pageSize }: SearchQuery): Promise<Array<any>> {
    if (q)
        return db.query(
            "select id, name, match(name) against(?) as relevance from restaurant order by relevance desc, id asc LIMIT ? OFFSET ?",
            [q, pageSize, pageSize * (page - 1)]
        )
    else return db.query(
        "select id, name from restaurant order by id asc LIMIT ? OFFSET ?",
        [pageSize, pageSize * (page - 1)]
    )
}

export { getRestaurants }