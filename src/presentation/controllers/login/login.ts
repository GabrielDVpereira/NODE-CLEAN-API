import { InvalidParamError } from '../../errors'
import { MissingParamError } from '../../errors/missing-param-error'
import { badRequest, serverError } from '../../helpers/http-helpers'
import { Controller, HttpRequest, HttpResponse } from '../../protocols'
import { EmailValidator } from '../signup/signup-protocols'

export class LoginController implements Controller {
  private readonly emailValidator: EmailValidator
  constructor (emailValidator) {
    this.emailValidator = emailValidator
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { email, password } = httpRequest.body
      if (!email) {
        return Promise.resolve(badRequest(new MissingParamError('email')))
      }

      if (!password) {
        return Promise.resolve(badRequest(new MissingParamError('password')))
      }

      const isEmailValid = this.emailValidator.isValid(email)
      if (!isEmailValid) {
        return Promise.resolve(badRequest(new InvalidParamError('email')))
      }
    } catch (error) {
      return serverError(error)
    }
  }
}
