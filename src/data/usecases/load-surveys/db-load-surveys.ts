import { SurveyModel } from '../../../domain/models/survey'
import { LoadSurveys } from '../../../domain/usecases/load-surveys'
import { LoadSurveysRespository } from '../../protocols/db/survey/load-survey-repository'

export class DbLoadSurveys implements LoadSurveys {
  constructor (
    private readonly loadSurveysRepository: LoadSurveysRespository
  ) {}

  async load (): Promise<SurveyModel[]> {
    await this.loadSurveysRepository.loadAll()
    return null
  }
}