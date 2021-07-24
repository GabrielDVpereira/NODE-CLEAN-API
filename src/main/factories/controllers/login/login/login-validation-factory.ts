
import { Validation } from '@/presentation/protocols/validation'
import { EmailValidatorAdapter } from '@/infra/validators/email-validator-adapter'
import { EmailValidation, RequiredFieldValidation, ValidationComposite } from '@/validation/validators'

export const makeLoginValidation = (): Validation => {
  const validations: Validation[] = []

  for (const field of ['email', 'password']) {
    validations.push(new RequiredFieldValidation(field))
  }
  const emailValidator = new EmailValidatorAdapter()
  validations.push(new EmailValidation('email', emailValidator))

  return new ValidationComposite(validations)
}
