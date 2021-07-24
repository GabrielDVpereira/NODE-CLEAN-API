import { LogErrorRepository } from '@/data/protocols/db/log/log-error-repository'
import { AccountModel } from '@/domain/models/account'
import { serverError, ok } from '@/presentation/helpers/http/http-helpers'
import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'
import { LoggerControllerDecorator } from './log-controller-decorator'

const makeLogErrorRepository = (): LogErrorRepository => {
  class LogErrorRepositoryStub implements LogErrorRepository {
    async logError (stack: string): Promise<void> {
      return Promise.resolve()
    }
  }
  return new LogErrorRepositoryStub()
}
const makeController = (): Controller => {
  class ControllerStub implements Controller {
    async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
      return Promise.resolve(ok(makeFakeAccount()))
    }
  }
  const controllerStub = new ControllerStub()
  return controllerStub
}

const makeFakeRequest = (): HttpRequest => ({
  body: {
    email: 'any_any_email@test.com',
    name: 'any_name',
    password: 'any_password',
    passwordConfirmation: 'any_password'
  }
})

const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  email: 'valid_email@email.com',
  name: 'valid_name',
  password: 'valid_password'

})

const makeFakeServerError = (): HttpResponse => {
  const fakeError = new Error()
  fakeError.stack = 'any_stack'
  return serverError(fakeError)
}

interface SutTypes {
  sut: LoggerControllerDecorator
  controllerStub: Controller
  logErrorRepositoryStub: LogErrorRepository

}

const makeSut = (): SutTypes => {
  const logErrorRepositoryStub = makeLogErrorRepository()
  const controllerStub = makeController()
  const sut = new LoggerControllerDecorator(controllerStub, logErrorRepositoryStub)
  return {
    sut,
    controllerStub,
    logErrorRepositoryStub
  }
}

describe('LogController Decorator', () => {
  test('Should call controller handle', async () => {
    const { sut, controllerStub } = makeSut()
    const spyOnHandle = jest.spyOn(controllerStub, 'handle')

    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(spyOnHandle).toBeCalledWith(httpRequest)
  })

  test('Should return the same result as the controller', async () => {
    const { sut } = makeSut()

    const httpRequest = makeFakeRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(ok(makeFakeAccount()))
  })

  test('Should should call LogErrorRepository with correct error if controller returns a server error', async () => {
    const { sut, controllerStub, logErrorRepositoryStub } = makeSut()
    jest.spyOn(controllerStub, 'handle').mockReturnValueOnce(Promise.resolve(makeFakeServerError()))
    const logSpy = jest.spyOn(logErrorRepositoryStub, 'logError')
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(logSpy).toHaveBeenCalledWith('any_stack')
  })
})
