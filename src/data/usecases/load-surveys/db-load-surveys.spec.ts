import { SurveyModel } from '@/domain/models/survey'
import { LoadSurveysRespository } from '@/data/protocols/db/survey/load-survey-repository'
import { DbLoadSurveys } from './db-load-surveys'
import MockDate from 'mockdate'

interface SutTypes {
  sut: DbLoadSurveys
  loadSurveysRepositoryStub: LoadSurveysRespository
}

const makeSut = (): SutTypes => {
  const loadSurveysRepositoryStub = makeLoadSurveyRepositoryStub()
  const sut = new DbLoadSurveys(loadSurveysRepositoryStub)

  return {
    sut,
    loadSurveysRepositoryStub
  }
}

const makeLoadSurveyRepositoryStub = (): LoadSurveysRespository => {
  class LoadSurveysRespositoryStub implements LoadSurveysRespository {
    async loadAll (): Promise<SurveyModel[]> {
      return Promise.resolve(makeFakeSurveys())
    }
  }

  return new LoadSurveysRespositoryStub()
}
const makeFakeSurveys = (): SurveyModel[] => {
  return [
    {
      id: 'any_id',
      question: 'any_question',
      answers: [{
        image: 'any_image',
        answer: 'any_answer'
      }],
      date: new Date()
    },
    {
      id: 'other_id',
      question: 'other_question',
      answers: [{
        image: 'other_image',
        answer: 'other_answer'
      }],
      date: new Date()
    }

  ]
}

describe('DbLoadSurveys', () => {
  beforeAll(() => {
    MockDate.set(new Date()) // freezing the date for tests
  })

  afterAll(() => {
    MockDate.reset()
  })
  test('Should call LoadSurveysRepository', async () => {
    const { sut, loadSurveysRepositoryStub } = makeSut()
    const loadAllSpy = jest.spyOn(loadSurveysRepositoryStub, 'loadAll')
    await sut.load()

    expect(loadAllSpy).toHaveBeenCalled()
  })
  test('Should return a list of surveys on succecss', async () => {
    const { sut } = makeSut()
    const response = await sut.load()

    expect(response).toEqual(makeFakeSurveys())
  })
  test('Should throw if LoadSurveysRepository throws', async () => {
    const { loadSurveysRepositoryStub, sut } = makeSut()
    jest.spyOn(loadSurveysRepositoryStub, 'loadAll').mockReturnValue(Promise.reject(new Error()))

    const response = sut.load()
    await expect(response).rejects.toThrow()
  })
})
