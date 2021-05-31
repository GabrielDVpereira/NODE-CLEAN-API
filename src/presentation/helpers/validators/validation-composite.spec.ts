import { MissingParamError } from '../../errors'
import { Validation } from './validation'
import { ValidationComposite } from './validation-composite'

describe('Valadation Composite', () => {
  test('Should return an error if any validation fails', () => {
    class ValidationSub implements Validation {
      validate (input: any): Error {
        return new MissingParamError('field')
      }
    }

    const validationStub = new ValidationSub()
    const sut = new ValidationComposite([validationStub])
    const error = sut.validate({ field: 'any_value' })

    expect(error).toEqual(new MissingParamError('field'))
  })
})
