import { MissingParamError } from '../errors/missing-param-error'
import { badRequest } from '../helpers/http-helpers'
import { httpRequest, httpResponse } from '../protocols/http'

export class SignUpController {
  handle (httpRequest: httpRequest): httpResponse {
    const requiredFiels = ['name', 'email']
    for (const field of requiredFiels) {
      if (!httpRequest.body[field]) {
        return badRequest(new MissingParamError(field))
      }
    }
  }
}
