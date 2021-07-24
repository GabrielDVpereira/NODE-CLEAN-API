import express from 'express'
import setUpMiddlewares from '@/main/config/middlewares'
import setRoutes from '@/main/config/routes'

const app = express()
setUpMiddlewares(app)
setRoutes(app)

export default app
