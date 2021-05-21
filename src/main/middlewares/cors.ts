
import { Request, Response, NextFunction } from 'express'

export const cors = (req: Request, res: Response, next: NextFunction): void => {
  res.set('access-control-allow-origin', '*') // setting a header to allow all origin
  res.set('access-control-allow-methods', '*') // setting a header to allow all methods
  res.set('access-control-allow-headers', '*') // setting a header to allow all headers
  next()
}
