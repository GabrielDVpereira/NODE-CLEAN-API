import { LogErrorRepository } from '../../data/protocols/db/log/log-error-repository'
import { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols'

/**
    This decorator implemets the Controller, which is the same interface from the Wrappee(class we want to decorate), this is important from a decorator because it we ensure that is follows the
    class impletamentation that we want to decorate, thus it can decorate any class that implements the same interface.
    Thefore, if we need the feature that our decorator implements, we could just use the decorator and pass the class we want to decorate using composition(instance)

    in  this case, we want to our decorator to log our error for every controller class.
 */

export class LoggerControllerDecorator implements Controller {
  private readonly controller: Controller
  private readonly logErrorRepository

  constructor (controller: Controller, logErrorRepository: LogErrorRepository) {
    this.controller = controller
    this.logErrorRepository = logErrorRepository
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const httpResponse = await this.controller.handle(httpRequest)

    // feat that our decorator decorates
    if (httpResponse.statusCode === 500) {
      await this.logErrorRepository.logError(httpResponse.body.stack)
    }
    return httpResponse
  }
}
