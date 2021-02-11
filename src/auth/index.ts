import * as express from 'express'
var authRouter = express.Router();
import { usersRouter } from './users'

authRouter.use(usersRouter)


export { authRouter }

