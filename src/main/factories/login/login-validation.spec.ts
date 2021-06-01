import { EmailValidation } from '../../../presentation/helpers/validators/email-validation'
import { RequiredFieldValidation } from '../../../presentation/helpers/validators/required-field-validation'
import { Validation } from '../../../presentation/protocols/validation'
import { ValidationComposite } from '../../../presentation/helpers/validators/validation-composite'
import { EmailValidator } from '../../../presentation/protocols/email-validator'
import { makeLoginValidation } from './login-validation'

jest.mock('../../../presentation/helpers/validators/validation-composite') // we mock this path, so when anyone calls this, will get a mocked result

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator { // stub is a mock for a test, we always return the value we expect from a method. We also implements a interface to ensure that the validator respects the protocol for validator
    isValid (email: string): boolean {
      return true
    }
  }

  return new EmailValidatorStub()
}

describe('login validation factory', () => {
  test('Should call validation composite with all validations', () => {
    makeLoginValidation()
    const validations: Validation[] = []

    for (const field of ['email', 'password']) {
      validations.push(new RequiredFieldValidation(field))
    }
    validations.push(new EmailValidation('email', makeEmailValidator()))

    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
