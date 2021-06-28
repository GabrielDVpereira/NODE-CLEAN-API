import { AccessDeniedError } from '../errors'
import { forbidden } from '../helpers/http/http-helpers'
import { Middleware, HttpRequest, HttpResponse } from '../protocols'

export class AuthMiddleware implements Middleware {
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    return Promise.resolve(forbidden(new AccessDeniedError()))
  }
}
