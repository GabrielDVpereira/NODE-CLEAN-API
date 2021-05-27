import {
  EmailValidator,
  Controller,
  HttpRequest,
  HttpResponse,
  AddAccount,
  Validation
} from './signup-protocols'

import {
  badRequest,
  ok,
  serverError
} from '../../helpers/http-helpers'

import {
  InvalidParamError,
  MissingParamError
} from '../../errors'

export class SignUpController implements Controller { // by making the class implement a controller interface, we ensure that all controllers will follow the controller methods we define
  private readonly emailValidator: EmailValidator // private - it's not acessible outside the class; read-only - it cannot be reasigned
  private readonly addAccount: AddAccount
  private readonly validation: Validation

  constructor (emailValidator: EmailValidator, addAccount: AddAccount, validation: Validation) { // dependecy inversion (Inversion of Control) as well as dependency injection. we have controll of the emailValidator dependencies (methods) by injecting it into the SignUpController class
    this.emailValidator = emailValidator
    this.addAccount = addAccount
    this.validation = validation
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      this.validation.validate(httpRequest.body)
      const requiredFiels = ['name', 'email', 'password', 'passwordConfirmation']

      for (const field of requiredFiels) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }

      const { name, email, password, passwordConfirmation } = httpRequest.body

      if (password !== passwordConfirmation) {
        return badRequest(new InvalidParamError('passwordConfirmation'))
      }

      const isValid = this.emailValidator.isValid(email)
      if (!isValid) {
        return badRequest(new InvalidParamError('email'))
      }

      // at this point, all validations passed, so we create the user with the dependency injection

      const account = await this.addAccount.add({
        name,
        email,
        password
      })

      return ok(account)
    } catch (error) {
      return serverError(error)
    }
  }
}
