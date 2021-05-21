// it has .test because it's an integration test, we have a script in package.json only to run integration tests

import request from 'supertest'
import app from '../config/app'

describe('Cors Middleware', () => {
  test('should enable CORS', async () => {
    app.post('/test_cors', (req, res) => {
      res.send()
    })
    await request(app)
      .get('/test_body_parser')
      .expect('access-control-allow-origin', '*') // we expect we can acess requests from any server
      .expect('access-control-allow-methods', '*')
      .expect('access-control-allow-headers', '*')
  })
})
