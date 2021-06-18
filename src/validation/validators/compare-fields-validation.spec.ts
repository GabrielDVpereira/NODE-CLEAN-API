import { InvalidParamError } from '../../presentation/errors'
import { CompareFieldsValidation } from './compare-fields-validation'

const makeSut = (): CompareFieldsValidation => {
  return new CompareFieldsValidation('any_field', 'field_to_compare')
}

describe('Compare field validation', () => {
  test('Should return a InvalidParamError if validation fails', () => {
    const sut = makeSut()
    const error = sut.validate({
      any_field: 'any_value',
      field_to_compare: 'any_diferent_value'
    })
    expect(error).toEqual(new InvalidParamError('field_to_compare'))
  })

  test('Should not return a InvalidParamError if validation succeeds', () => {
    const sut = makeSut()
    const error = sut.validate({
      any_field: 'any_value',
      field_to_compare: 'any_value'
    })
    expect(error).toBeFalsy()
  })
})
