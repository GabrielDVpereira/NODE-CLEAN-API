import { Controller } from '@/presentation/protocols'
import { makeLogControllerDecorator } from '@/main/factories/decoratos/log-controller-decorator-factory'

import { LoadSurveysController } from '@/presentation/controllers/survey/load-surveys/load-surveys-controller'
import { makeDbLoadSurvey } from '@/main/factories/usecases/survey/load-survey/db-load-survey-account-factory'

export const makeLoadSurveyController = (): Controller => {
  const controller = new LoadSurveysController(makeDbLoadSurvey())
  return makeLogControllerDecorator(controller)
}
