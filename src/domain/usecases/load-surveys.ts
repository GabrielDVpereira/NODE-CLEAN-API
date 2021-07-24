import { SurveyModel } from '@/domain/models/survey'

export interface LoadSurveys {
  load: () => Promise<SurveyModel[]> // AccountModel is database related, so we dont use it inside domain
}
