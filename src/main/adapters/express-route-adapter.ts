import { Controller, HttpRequest } from '../../presentation/protocols'
import { Request, Response } from 'express'

// adapter to adapt the response of express to the controller we're using
export const adaptRoute = (controller: Controller) => {
  return async (req: Request, res: Response): Promise<void> => {
    const httpRequest: HttpRequest = {
      body: req.body
    }
    const httpRespons = await controller.handle(httpRequest)
    res.status(httpResponse.statusCode).json(httpResponse.body)
  }
}
