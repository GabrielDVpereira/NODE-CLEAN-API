import { Express, Router } from 'express'
import { readdirSync } from 'fs' // file system library
import path from 'path'
export default (app: Express): void => {
  const router = Router()
  app.use('/api', router)
  readdirSync(path.join(__dirname, '..', 'routes')
  ).map(async file => {
    if (!file.includes('.test.')) {
      (await import(path.join(__dirname, '..', 'routes', file))).default(router)
    }
  })
}
