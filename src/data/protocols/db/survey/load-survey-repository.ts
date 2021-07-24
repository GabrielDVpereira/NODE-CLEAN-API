import { SurveyModel } from '@/domain/models/survey'

export interface LoadSurveysRespository {
  loadAll: () => Promise<SurveyModel[]>
}
