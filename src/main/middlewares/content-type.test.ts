// it has .test because it's an integration test, we have a script in package.json only to run integration tests

import request from 'supertest'
import app from '../config/app'

describe('Content-Type Middleware', () => {
  // the default content type has to be json
  test('should return default content type as json', async () => {
    app.get('/test_content_type_default', (req, res) => {
      res.send('')
    })
    await request(app)
      .get('/test_content_type_default')
      .expect('content-type', /json/)
  })

  test('should return xml content type when forced', async () => {
    app.get('/test_content_type_xml', (req, res) => {
      res.type('xml')
      res.send('')
    })
    await request(app)
      .get('/test_content_type_xml')
      .expect('content-type', /xml/)
  })
})
