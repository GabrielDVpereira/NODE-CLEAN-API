// it has .test because it's an integration test, we have a script in package.json only to run integration tests

import request from 'supertest'
import app from '../config/app'

describe('SignUp Routes', () => {
  test('should return an account on sucess', async () => {
    await request(app)
      .post('/api/signup')
      .send({
        name: 'Gabriel',
        email: 'Gabriel.davi.99@gmail.com',
        password: '123456',
        passwordConfirmation: '123456'
      })
      .expect(200)
  })
})
