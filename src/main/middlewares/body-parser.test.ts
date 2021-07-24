// it has .test because it's an integration test, we have a script in package.json only to run integration tests

import request from 'supertest'
import app from '@/main/config/app'

describe('Body Parser Middleware', () => {
  test('should parse body as json', async () => {
    app.post('/test_body_parser', (req, res) => {
      res.send(req.body)
    })
    await request(app)
      .post('/test_body_parser')
      .send({ name: 'Gabriel' })
      .expect({ name: 'Gabriel' })
  })
})
