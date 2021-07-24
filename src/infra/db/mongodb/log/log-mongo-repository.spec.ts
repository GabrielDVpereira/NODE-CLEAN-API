import { Collection } from 'mongodb'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import { LogMongoRepository } from './log-mongo-repository'

const makeSut = (): LogMongoRepository => {
  return new LogMongoRepository()
}
describe('Log Mongo', () => {
  let errorColletion: Collection
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL) // jest-mongodb sets a db url for us in the env
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })
  beforeEach(async () => {
    errorColletion = await MongoHelper.getCollection('errors')
    await errorColletion.deleteMany({}) // cleaning the collection before each test
  })

  test('Should create an error log on sucess', async () => {
    const sut = makeSut()
    await sut.logError('any_error')
    const count = await errorColletion.countDocuments()
    expect(count).toBe(1) // we ensure that the the document was inserted in the collection
  })
})
