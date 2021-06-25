import { AddSurveyModel, AddSurveyRepository } from './add-survey-protocols'
import { DbAddSurvey } from './db-add-survey'

describe('DbAddSurvey UseCase', () => {
  const makeFakeSurveyData = (): AddSurveyModel => ({
    question: 'any_question',
    answers: [{
      image: 'anyn_image',
      answer: 'any_answer'
    }]
  })
  test('Should call AddSurveyRepopsitory with correct values', async () => {
    class AddSurveyRepositoryStub implements AddSurveyRepository {
      async add (surveyData: AddSurveyModel): Promise<void> {
        return Promise.resolve()
      }
    }

    const addSurveyRepositoryStub = new AddSurveyRepositoryStub()
    const addSpy = jest.spyOn(addSurveyRepositoryStub, 'add')
    const sut = new DbAddSurvey(addSurveyRepositoryStub)
    const surveyData = makeFakeSurveyData()
    await sut.add(surveyData)

    expect(addSpy).toBeCalledWith(surveyData)
  })
})
