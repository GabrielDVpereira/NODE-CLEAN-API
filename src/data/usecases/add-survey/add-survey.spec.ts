import { AddSurveyModel, AddSurveyRepository } from './add-survey-protocols'
import { DbAddSurvey } from './db-add-survey'
import MockDate from 'mockdate'

type SutTypes = {
  sut: DbAddSurvey
  addSurveyRepositoryStub: AddSurveyRepository
}
const makeSut = (): SutTypes => {
  const addSurveyRepositoryStub = makeAddSurveyRepository()
  const sut = new DbAddSurvey(addSurveyRepositoryStub)
  return {
    sut, addSurveyRepositoryStub
  }
}

const makeAddSurveyRepository = (): AddSurveyRepository => {
  class AddSurveyRepositoryStub implements AddSurveyRepository {
    async add (surveyData: AddSurveyModel): Promise<void> {
      return Promise.resolve()
    }
  }
  return new AddSurveyRepositoryStub()
}

const makeFakeSurveyData = (): AddSurveyModel => ({
  question: 'any_question',
  answers: [{
    image: 'anyn_image',
    answer: 'any_answer'
  }],
  date: new Date()
})

describe('DbAddSurvey UseCase', () => {
  beforeAll(() => {
    MockDate.set(new Date()) // freezing the date for tests
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('Should call AddSurveyRepopsitory with correct values', async () => {
    const { addSurveyRepositoryStub, sut } = makeSut()
    const addSpy = jest.spyOn(addSurveyRepositoryStub, 'add')
    const surveyData = makeFakeSurveyData()
    await sut.add(surveyData)
    expect(addSpy).toBeCalledWith(surveyData)
  })

  test('Should throw if AddSurveyRepopsitory throws', async () => {
    const { addSurveyRepositoryStub, sut } = makeSut()
    jest.spyOn(addSurveyRepositoryStub, 'add').mockReturnValue(Promise.reject(new Error()))
    const surveyData = makeFakeSurveyData()
    const response = sut.add(surveyData)
    await expect(response).rejects.toThrow()
  })
})
