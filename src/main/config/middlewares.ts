import { Express } from 'express'
import { bodyparser } from '../middlewares/body-parser'
import { cors } from '../middlewares/cors'
export default (app: Express): void => {
  app.use(bodyparser)
  app.use(cors)
}
