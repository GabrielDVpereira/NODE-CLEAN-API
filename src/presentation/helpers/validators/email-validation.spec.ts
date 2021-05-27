import { EmailValidation } from './email-validation'
import { EmailValidator } from '../../protocols/email-validator'
import { InvalidParamError } from '../../errors'

interface SutTypes {
  sut: EmailValidation
  emailValidatorStub: EmailValidator

}

const makeSut = (): SutTypes => { // factory to implement only once the class instancication
  const emailValidatorStub = makeEmailValidator()

  const sut = new EmailValidation('email', emailValidatorStub) // dependency injection

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

describe('Email validation', () => {
  test('Should return an error if email validator returns false', () => {
    const { sut, emailValidatorStub } = makeSut() // system under test
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false) // we use jest to mock the return of the method "isValid" from the emailValidatorStub obj to false
    const error = sut.validate({ email: 'any_email@mail.com' })
    expect(error).toEqual(new InvalidParamError('email')) // toBe is not used in this case bacause when the comparison is objects, it also checks the reference, thus it will fail.
  })

  test('Should call email validator with correct email ', () => {
    const { sut, emailValidatorStub } = makeSut() // system under test

    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid') // we capture the return of the call of isValid method
    sut.validate({ email: 'any_email@test.com' })
    expect(isValidSpy).toHaveBeenCalledWith('any_email@test.com') // we check if the isValidSpy return has been called with the given value
    // toEqual checks only the value
  })

  test('Should throw if emailValidator throws', () => {
    const { sut, emailValidatorStub } = makeSut()

    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => { // we change the implementation of the class method "isValid"
      throw new Error()
    })

    expect(sut.validate).toThrow()
  })
})
