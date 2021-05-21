import express from 'express'
import setUpMiddlewares from '../config/middlewares'
import setRoutes from '../config/routes'

const app = express()
setUpMiddlewares(app)
setRoutes(app)

export default app
