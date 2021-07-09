import { SurveyModel } from '../models/survey'

export interface LoadSurveys {
  load: () => Promise<SurveyModel[]> // AccountModel is database related, so we dont use it inside domain
}
