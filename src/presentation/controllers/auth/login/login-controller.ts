import { Controller, HttpRequest, HttpResponse, Authentication, Validation } from './login-controller-protocols'

import { badRequest, ok, serverError, unauthorized } from '../../../helpers/http/http-helpers'

export class LoginController implements Controller {
  constructor (private readonly authentication: Authentication,
    private readonly validation: Validation) { } // the same as declarating the vars on top of the class and assigning to it in the constructor

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { email, password } = httpRequest.body
      const error = this.validation.validate(httpRequest.body)
      if (error) {
        return badRequest(error)
      }

      const accessToken = await this.authentication.auth({ email, password })
      if (!accessToken) {
        return unauthorized()
      }

      return ok(accessToken)
    } catch (error) {
      return serverError(error)
    }
  }
}
