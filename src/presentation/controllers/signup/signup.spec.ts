import { SignUpController } from './signup'
import { EmailValidator, AddAccount, AddAccountModel, AccountModel, Validation } from './signup-protocols'
import { InvalidParamError, MissingParamError, ServerError } from '../../errors'
import { HttpRequest } from '../../protocols'
import { ok, serverError, badRequest } from '../../helpers/http-helpers'

interface SutTypes {
  sut: SignUpController
  emailValidatorStub: EmailValidator
  addAccountStub: AddAccount
  validationStub: Validation
}

const makeSut = (): SutTypes => { // factory to implement only once the class instancication
  const emailValidatorStub = makeEmailValidator()
  const addAccountStub = makeAddAccount()
  const validationStub = makeValidation()
  const sut = new SignUpController(emailValidatorStub, addAccountStub, validationStub) // dependency injection

  return {
    sut,
    emailValidatorStub,
    addAccountStub,
    validationStub
  }
}

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator { // stub is a mock for a test, we always return the value we expect from a method. We also implements a interface to ensure that the validator respects the protocol for validator
    isValid (email: string): boolean {
      return true
    }
  }

  return new EmailValidatorStub()
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
  test('Should return 400 if no name is provided', async () => {
    const { sut } = makeSut() // system under test

    const httpRequest = {
      body: {
        email: 'any_email@test.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'

      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('name'))) // toBe is not used in this case bacause when the comparison is objects, it also checks the reference, thus it will fail.
  })

  test('Should return 400 if no email is provided', async () => {
    const { sut } = makeSut() // system under test

    const httpRequest = {
      body: {
        name: 'any_name',
        password: 'any_password',
        passwordConfirmation: 'any_password'

      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('email'))) // toBe is not used in this case bacause when the comparison is objects, it also checks the reference, thus it will fail.
  })

  test('Should return 400 if no password is provided', async () => {
    const { sut } = makeSut() // system under test

    const httpRequest = {
      body: {
        email: 'any_email@test.com',
        name: 'any_name',
        passwordConfirmation: 'any_password'

      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('password'))) // toBe is not used in this case bacause when the comparison is objects, it also checks the reference, thus it will fail.
  })

  test('Should return 400 if no passwordConfirmation is provided', async () => {
    const { sut } = makeSut() // system under test

    const httpRequest = {
      body: {
        email: 'any_email@test.com',
        name: 'any_name',
        password: 'any_password'

      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('passwordConfirmation'))) // toBe is not used in this case bacause when the comparison is objects, it also checks the reference, thus it will fail.
  })

  test('Should return 400 if passwordConfirmation fails', async () => {
    const { sut } = makeSut() // system under test

    const httpRequest = {
      body: {
        email: 'any_email@test.com',
        name: 'any_name',
        password: 'any_password',
        passwordConfirmation: 'invalid_password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('passwordConfirmation'))) // toBe is not used in this case bacause when the comparison is objects, it also checks the reference, thus it will fail.
  })

  test('Should return 400 if an invalid email is provided', async () => {
    const { sut, emailValidatorStub } = makeSut() // system under test

    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false) // we use jest to mock the return of the method "isValid" from the emailValidatorStub obj to false

    const httpRequest = makeFakeRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('email'))) // toBe is not used in this case bacause when the comparison is objects, it also checks the reference, thus it will fail.
  })

  test('Should call email validator with correct email ', async () => {
    const { sut, emailValidatorStub } = makeSut() // system under test

    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid') // we capture the return of the call of isValid method

    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(isValidSpy).toHaveBeenCalledWith('any_any_email@test.com') // we check if the isValidSpy return has been called with the given value
    // toEqual checks only the value
  })

  test('Should return 500 emailValidator throws', async () => {
    const { emailValidatorStub, sut } = makeSut()

    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => { // we change the implementation of the class method "isValid"
      throw new Error()
    })

    const httpRequest = makeFakeRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(serverError(new ServerError(null))) // toBe is not used in this case bacause when the comparison is objects, it also checks the reference, thus it will fail.
  })

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

    const validateSpy = jest.spyOn(validationStub, 'validate') // we capture the return of the call of isValid method

    const httpRequest = makeFakeRequest()

    await sut.handle(httpRequest)
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body) // we check if the isValidSpy return has been called with the given value
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
