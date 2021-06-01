import { SignUpController } from './signup'
import { AddAccount, AddAccountModel, AccountModel, Validation } from './signup-protocols'
import { MissingParamError, ServerError } from '../../errors'
import { HttpRequest } from '../../protocols'
import { ok, serverError, badRequest } from '../../helpers/http-helpers'

interface SutTypes {
  sut: SignUpController
  addAccountStub: AddAccount
  validationStub: Validation
}

const makeSut = (): SutTypes => { // factory to implement only once the class instancication
  const addAccountStub = makeAddAccount()
  const validationStub = makeValidation()
  const sut = new SignUpController(addAccountStub, validationStub) // dependency injection

  return {
    sut,
    addAccountStub,
    validationStub
  }
}

const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount { // stub is a mock for a test, we always return the value we expect from a method. We also implements a interface to ensure that the validator respects the protocol for validator
    async add (account: AddAccountModel): Promise<AccountModel> { // AccountModel will have more fields than AddAccountModel like _id, name, createdAt and so on
      const fakeAccount = makeFakeAccount()

      return await new Promise(resolve => resolve(fakeAccount))
    }
  }

  return new AddAccountStub()
}

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any): Error {
      return null // validation returns sucess if theres no error, so null
    }
  }

  return new ValidationStub()
}

const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  email: 'valid_email@email.com',
  name: 'valid_name',
  password: 'valid_password'

})

const makeFakeRequest = (): HttpRequest => ({
  body: {
    email: 'any_any_email@test.com',
    name: 'any_name',
    password: 'any_password',
    passwordConfirmation: 'any_password'
  }
})

describe('SignUp Controller', () => {
  test('Should return 500 if addAccount throws', async () => {
    const { addAccountStub, sut } = makeSut()

    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(async () => { // we change the implementation of the class method "add"
      return await new Promise((resolve, reject) => reject(new Error())) // the original method is async, so it's correct to make it return a promise
    })

    const httpRequest = makeFakeRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(serverError(new ServerError(null))) // toBe is not used in this case bacause when the comparison is objects, it also checks the reference, thus it will fail.
  })

  test('Should call addAccount with correct values', async () => {
    const { sut, addAccountStub } = makeSut() // system under test

    const addSpy = jest.spyOn(addAccountStub, 'add') // we capture the return of the call of isValid method

    const httpRequest = makeFakeRequest()

    await sut.handle(httpRequest)
    expect(addSpy).toHaveBeenCalledWith({
      email: 'any_any_email@test.com',
      name: 'any_name',
      password: 'any_password'
    }) // we check if the isValidSpy return has been called with the given value
    // toEqual checks only the value
  })

  test('Should return 200 if a valid data is provided', async () => {
    const { sut } = makeSut() // system under test

    const httpRequest = makeFakeRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(ok(makeFakeAccount()))
  })

  test('Should call validator with correct value', async () => {
    const { sut, validationStub } = makeSut() // system under test

    const validateSpy = jest.spyOn(validationStub, 'validate') // we capture the return of the call of validate method

    const httpRequest = makeFakeRequest()

    await sut.handle(httpRequest)
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body) // we check if the validateSpy return has been called with the given value
    // toEqual checks only the value
  })

  test('Should return 400 if validation returns a error', async () => {
    const { sut, validationStub } = makeSut() // system under test

    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new MissingParamError('any_field'))
    const httpRequest = makeFakeRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('any_field')))
  })
})
