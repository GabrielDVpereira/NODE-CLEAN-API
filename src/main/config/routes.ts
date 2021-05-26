import { Express, Router } from 'express'
import fg from 'fast-glob' // file system library

export default (app: Express): void => {
  const router = Router()
  app.use('/api', router)
  fg.sync('**/src/main/routes/**routes.ts') // dinamically importing all routes that has routes.ts as end
    .map(async file => {
      const route = (await import(`../../../${file}`)).default // dinamic import, in this case we are catching the default exported from the imported path
      route(router) // the imported file exports a function that expects a router(type Router) to set its own routes
    })
}
