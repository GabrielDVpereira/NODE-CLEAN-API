import { SignUpController } from './signup'
import { MissingParamError } from '../errors/missing-param-error'

describe('SignUp Controller', () => {
  test('Should return 400 if no name is provided', () => {
    const sut = new SignUpController() // system under test

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
    const sut = new SignUpController() // system under test

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
    const sut = new SignUpController() // system under test

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
    const sut = new SignUpController() // system under test

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
})
