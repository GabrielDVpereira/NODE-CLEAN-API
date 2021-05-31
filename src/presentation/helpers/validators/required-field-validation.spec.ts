import { MissingParamError } from '../../errors'
import { RequiredFieldValidation } from './required-field-validation'

describe('Required field validation', () => {
  test('Should return a MissingParamError if validation fails', () => {
    const sut = new RequiredFieldValidation('any_field')
    const error = sut.validate({
      name: 'any_name'
    })
    expect(error).toEqual(new MissingParamError('any_field'))
  })

  test('Should not return a MissingParamError if validation succeeds', () => {
    const sut = new RequiredFieldValidation('any_field')
    const error = sut.validate({
      any_field: 'any_value'
    })
    expect(error).toBeFalsy()
  })
})
