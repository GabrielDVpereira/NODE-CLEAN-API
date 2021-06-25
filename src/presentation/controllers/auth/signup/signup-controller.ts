import {
  Controller,
  HttpRequest,
  HttpResponse,
  AddAccount,
  Validation
} from './signup-controller-protocols'

import {
  badRequest,
  forbidden,
  ok,
  serverError
} from '../../../helpers/http/http-helpers'
import { Authentication } from '../login/login-controller-protocols'
import { EmailInUseError } from '../../../errors'

export class SignUpController implements Controller { // by making the class implement a controller interface, we ensure that all controllers will follow the controller methods we define
  constructor (
    private readonly addAccount: AddAccount,
    private readonly validation: Validation,
    private readonly authentication: Authentication) { // dependecy inversion (Inversion of Control) as well as dependency injection. we have controll of the emailValidator dependencies (methods) by injecting it into the SignUpController class
  } // the same as declarating the vars on top of the class and assigning to it in the constructor

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) {
        return badRequest(error)
      }
      const { name, email, password } = httpRequest.body
      const account = await this.addAccount.add({
        name,
        email,
        password
      })

      if (!account) {
        return forbidden(new EmailInUseError())
      }

      const accessToken = await this.authentication.auth({
        email, password
      })

      return ok({ accessToken })
    } catch (error) {
      console.log(error)
      return serverError(error)
    }
  }
}
