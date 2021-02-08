import * as express from 'express'
import { restaurantsRouter } from './restaurants'
var restaurantRouter = express.Router();


restaurantRouter.use(restaurantsRouter)
restaurantRouter.use(function (err, req: express.Request, res: express.Response, next: express.NextFunction) {
    if (err instanceof SyntaxError) {
        err = true;
        res.status(400);
        res.send({ message: "Malformed input, request is not a valid JSON" });
        return
    } else
        next();
})

export { restaurantRouter }