import { Express } from 'express'
import { bodyparser } from '../middlewares/body-parser'
export default (app: Express): void => {
  app.use(bodyparser)
}
