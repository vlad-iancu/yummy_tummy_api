import * as express from 'express'
var authRouter = express.Router();
import { usersRouter } from './users'

authRouter.use(usersRouter)
authRouter.use(function (err, req: express.Request, res: express.Response, next: express.NextFunction) {
    if (err instanceof SyntaxError) {
        err = true;
        res.status(400);
        res.send({ message: "Malformed input, request is not a valid JSON" });
        return
    } else
        next();
})

export { authRouter }

