import { Controller, HttpRequest, HttpResponse, EmailValidator, Authentication } from './login-protocols'
import { InvalidParamError } from '../../errors'
import { MissingParamError } from '../../errors/missing-param-error'
import { badRequest, ok, serverError, unauthorized } from '../../helpers/http-helpers'

export class LoginController implements Controller {
  private readonly emailValidator: EmailValidator
  private readonly authentication: Authentication

  constructor (emailValidator: EmailValidator, authentication: Authentication) {
    this.emailValidator = emailValidator
    this.authentication = authentication
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredFiels = ['email', 'password']
      for (const field of requiredFiels) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }

      const { email, password } = httpRequest.body
      const isEmailValid = this.emailValidator.isValid(email)
      if (!isEmailValid) {
        return badRequest(new InvalidParamError('email'))
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
