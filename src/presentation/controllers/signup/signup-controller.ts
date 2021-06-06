import {
  Controller,
  HttpRequest,
  HttpResponse,
  AddAccount,
  Validation
} from './signup-controller-protocols'

import {
  badRequest,
  ok,
  serverError
} from '../../helpers/http/http-helpers'

export class SignUpController implements Controller { // by making the class implement a controller interface, we ensure that all controllers will follow the controller methods we define
  constructor (
    private readonly addAccount: AddAccount,
    private readonly validation: Validation) { // dependecy inversion (Inversion of Control) as well as dependency injection. we have controll of the emailValidator dependencies (methods) by injecting it into the SignUpController class
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

      return ok(account)
    } catch (error) {
      return serverError(error)
    }
  }
}
