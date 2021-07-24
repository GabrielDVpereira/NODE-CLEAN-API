import { Validation } from '@/presentation/protocols/validation'
import { ValidationComposite, CompareFieldsValidation, EmailValidation, RequiredFieldValidation } from '@/validation/validators'
import { EmailValidatorAdapter } from '@/infra/validators/email-validator-adapter'

export const makeSignUpValidation = (): Validation => {
  const validations: Validation[] = []

  for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
    validations.push(new RequiredFieldValidation(field))
  }
  validations.push(new CompareFieldsValidation('password', 'passwordConfirmation'))
  const emailValidator = new EmailValidatorAdapter()
  validations.push(new EmailValidation('email', emailValidator))

  return new ValidationComposite(validations)
}
