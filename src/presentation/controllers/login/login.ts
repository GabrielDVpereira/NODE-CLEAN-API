import { Controller, HttpRequest, HttpResponse, Authentication, Validation } from './login-protocols'

import { badRequest, ok, serverError, unauthorized } from '../../helpers/http-helpers'

export class LoginController implements Controller {
  private readonly authentication: Authentication
  private readonly validation: Validation

  constructor (authentication: Authentication, validation: Validation) {
    this.authentication = authentication
    this.validation = validation
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { email, password } = httpRequest.body
      const error = this.validation.validate(httpRequest.body)
      if (error) {
        return badRequest(error)
      }

      const accessToken = await this.authentication.auth(email, password)
      if (!accessToken) {
        return unauthorized()
      }

      return ok(accessToken)
    } catch (error) {
      return serverError(error)
    }
  }
}
