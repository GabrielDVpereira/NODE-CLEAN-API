import { Express } from 'express'
import { bodyparser, contentType, cors } from '../middlewares'

export default (app: Express): void => {
  app.use(bodyparser)
  app.use(cors)
  app.use(contentType)
}
