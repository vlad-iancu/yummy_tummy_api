import { Database } from "../data/Database";
import { firebaseApp } from "../Firebase";
import { SearchQuery } from "./restaurants";

interface DbRestaurant {
    id: number,
    name: string,
    locationId?: number,
    thumbnailPath?: string,
    photoPath?: string,
    relevance?: boolean
}
interface Restaurant {
    id: number,
    name: string,
    locationId?: number,
    thumbnailUrl?: string,
    photoUrl?: string,
}
async function getRestaurants(db: Database, { q, page, pageSize }: SearchQuery): Promise<Array<Restaurant>> {
    let dbRestaurants: Array<DbRestaurant> = []
    if (q)
        dbRestaurants = await db.query(
            "select id, name, photoPath, thumbnailPath, match(name) against(?) as relevance from restaurant order by relevance desc, id asc LIMIT ? OFFSET ?",
            [q, pageSize, pageSize * (page - 1)]
        )
    else dbRestaurants = await db.query(
        "select id, name, photoPath, thumbnailPath from restaurant order by id asc LIMIT ? OFFSET ?",
        [pageSize, pageSize * (page - 1)]
    )
    let restaurants = await Promise.all(dbRestaurants.map(async (dbRestaurant): Promise<Restaurant> => {
        let thumbnailUrl: string = dbRestaurant.thumbnailPath ?
            (await firebaseApp.storage().bucket()
                .file(dbRestaurant.thumbnailPath)
                .getSignedUrl({ action: "read", expires: "03-09-2491" }))[0] : ""
        let photoUrl: string = dbRestaurant.photoPath ?
            (await firebaseApp.storage().bucket()
                .file(dbRestaurant.photoPath)
                .getSignedUrl({ action: "read", expires: "03-09-2491" }))[0] : ""
        return { ...dbRestaurant, photoUrl, thumbnailUrl }
    }))
    //await firebaseApp.storage().bucket().file('restaurants/thumbnail/profile.jpg').getSignedUrl({ action: "read", expires: "03-09-2491" })

    return restaurants
}

export { getRestaurants }