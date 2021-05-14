import {
  EmailValidator,
  Controller,
  HttpRequest,
  HttpResponse
} from '../protocols'

import {
  badRequest,
  serverError
} from '../helpers/http-helpers'

import {
  InvalidParamError,
  MissingParamError
} from '../errors'

export class SignUpController implements Controller { // by making the class implement a controller interface, we ensure that all controllers will follow the controller methods we define
  private readonly emailValidator: EmailValidator // private - it's not acessible outside the class; read-only - it cannot be reasigned

  constructor (emailValidator: EmailValidator) { // dependecy inversion (Inversion of Control) as well as dependency injection. we have controll of the emailValidator dependencies (methods) by injecting it into the SignUpController class
    this.emailValidator = emailValidator
  }

  handle (httpRequest: HttpRequest): HttpResponse {
    try {
      const requiredFiels = ['name', 'email', 'password', 'passwordConfirmation']

      for (const field of requiredFiels) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }

      if (httpRequest.body.password !== httpRequest.body.passwordConfirmation) {
        return badRequest(new InvalidParamError('passwordConfirmation'))
      }

      const isValid = this.emailValidator.isValid(httpRequest.body.email)
      if (!isValid) {
        return badRequest(new InvalidParamError('email'))
      }
    } catch (error) {
      return serverError()
    }
  }
}
