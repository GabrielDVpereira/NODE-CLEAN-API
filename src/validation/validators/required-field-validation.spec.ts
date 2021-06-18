import { MissingParamError } from '../../presentation/errors'
import { RequiredFieldValidation } from './required-field-validation'

const makeSut = (): RequiredFieldValidation => {
  return new RequiredFieldValidation('any_field')
}

describe('Required field validation', () => {
  test('Should return a MissingParamError if validation fails', () => {
    const sut = makeSut()
    const error = sut.validate({
      name: 'any_name'
    })
    expect(error).toEqual(new MissingParamError('any_field'))
  })

  test('Should not return a MissingParamError if validation succeeds', () => {
    const sut = makeSut()
    const error = sut.validate({
      any_field: 'any_value'
    })
    expect(error).toBeFalsy()
  })
})
