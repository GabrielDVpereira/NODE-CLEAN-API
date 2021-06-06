// it has .test because it's an integration test, we have a script in package.json only to run integration tests

import { Collection } from 'mongodb'
import request from 'supertest'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import app from '../config/app'
import bcrypt from 'bcrypt'

let accountCollection: Collection
describe('Login Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL) // jest-mongodb sets a db url for us in the env
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })
  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({}) // cleaning the collection before each test
  })
  describe('POST /signup', () => {
    test('should return 200 on signup', async () => {
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

  describe('POST /login', () => {
    test('should return 200 on login', async () => {
      const hashedPass = await bcrypt.hash('123456', 12)
      await accountCollection.insertOne({
        name: 'Gabriel',
        email: 'Gabriel.davi.99@gmail.com',
        password: hashedPass
      })
      await request(app)
        .post('/api/login')
        .send({
          email: 'Gabriel.davi.99@gmail.com',
          password: '123456'
        })
        .expect(200)
    })

    test('should return 401 on login', async () => {
      await request(app)
        .post('/api/login')
        .send({
          email: 'Gabriel.davi.99@gmail.com',
          password: '123456'
        })
        .expect(401)
    })
  })
})
