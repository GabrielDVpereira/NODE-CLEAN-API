import { SignUpController } from './signup'
import { EmailValidator } from '../protocols'

import { InvalidParamError, MissingParamError, ServerError } from '../errors'

interface SutTypes {
  sut: SignUpController
  emailValidatorStub: EmailValidator
}

const makeSut = (): SutTypes => { // by moving the instanciation to a new class, we ensure that if we neet to pass a new dependency to the SignUpController(), we change in one place
  const emailValidatorStub = makeEmailValidator()
  const sut = new SignUpController(emailValidatorStub) // dependency injection

  return {
    sut,
    emailValidatorStub
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

const makeEmailValidatorWithError = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator { // stub is a mock for a test, we always return the value we expect from a method. We also implements a interface to ensure that the validator respects the protocol for validator
    isValid (email: string): boolean {
      throw new Error()
    }
  }

  return new EmailValidatorStub()
}

describe('SignUp Controller', () => {
  test('Should return 400 if no name is provided', () => {
    const { sut } = makeSut() // system under test

    const httpRequest = {
      body: {
        email: 'any_email@test.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'

      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('name')) // toBe is not used in this case bacause when the comparison is objects, it also checks the reference, thus it will fail.
    // toEqual checks only the value
  })

  test('Should return 400 if no email is provided', () => {
    const { sut } = makeSut() // system under test

    const httpRequest = {
      body: {
        name: 'any_name',
        password: 'any_password',
        passwordConfirmation: 'any_password'

      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email')) // toBe is not used in this case bacause when the comparison is objects, it also checks the reference, thus it will fail.
    // toEqual checks only the value
  })

  test('Should return 400 if no password is provided', () => {
    const { sut } = makeSut() // system under test

    const httpRequest = {
      body: {
        email: 'any_email@test.com',
        name: 'any_name',
        passwordConfirmation: 'any_password'

      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password')) // toBe is not used in this case bacause when the comparison is objects, it also checks the reference, thus it will fail.
    // toEqual checks only the value
  })

  test('Should return 400 if no passwordConfirmation is provided', () => {
    const { sut } = makeSut() // system under test

    const httpRequest = {
      body: {
        email: 'any_email@test.com',
        name: 'any_name',
        password: 'any_password'

      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('passwordConfirmation')) // toBe is not used in this case bacause when the comparison is objects, it also checks the reference, thus it will fail.
    // toEqual checks only the value
  })

  test('Should return 400 if an invalid email is provided', () => {
    const { sut, emailValidatorStub } = makeSut() // system under test

    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false) // we use jest to mock the return of the method "isValid" from the emailValidatorStub obj to false

    const httpRequest = {
      body: {
        email: 'invalid_any_email@test.com',
        name: 'any_name',
        password: 'any_password',
        passwordConfirmation: 'any_password'

      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('email')) // toBe is not used in this case bacause when the comparison is objects, it also checks the reference, thus it will fail.
    // toEqual checks only the value
  })

  test('Should call email validator with correct email ', () => {
    const { sut, emailValidatorStub } = makeSut() // system under test

    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid') // we capture the return of the call of isValid method

    const httpRequest = {
      body: {
        email: 'any_any_email@test.com',
        name: 'any_name',
        password: 'any_password',
        passwordConfirmation: 'any_password'

      }
    }
    sut.handle(httpRequest)
    expect(isValidSpy).toHaveBeenCalledWith('any_any_email@test.com') // we check if the isValidSpy return has been called with the given value
    // toEqual checks only the value
  })

  test('Should return 500 emailValidator throws', () => {
    const emailValidatorStub = makeEmailValidatorWithError()
    const sut = new SignUpController(emailValidatorStub) // dependency injection

    const httpRequest = {
      body: {
        email: 'any_any_email@test.com',
        name: 'any_name',
        password: 'any_password',
        passwordConfirmation: 'any_password'

      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError()) // toBe is not used in this case bacause when the comparison is objects, it also checks the reference, thus it will fail.
    // toEqual checks only the value
  })
})
