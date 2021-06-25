import { Collection } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { SurveyMongoRepository } from './survey-mongo-repository'

// since we are testing a db integrated with a class, we cannot mock the mongodb functions because it's too painful, so we use a offline db helper and test only the sucess case
let surveyCollection: Collection
describe('Survey Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL) // jest-mongodb sets a db url for us in the env
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })
  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({}) // cleaning the collection before each test
  })

  const makeSut = (): SurveyMongoRepository => {
    return new SurveyMongoRepository()
  }

  test('Should return a survey on add sucess', async () => {
    const sut = makeSut()
    await sut.add({
      question: 'any_question',
      answers: [{
        image: 'any_image',
        answer: 'any_answer'
      },
      {
        answer: 'other_answer'
      }
      ]
    })

    const survey = await surveyCollection.findOne({ question: 'any_question' })
    expect(survey).toBeTruthy()
  })
})
