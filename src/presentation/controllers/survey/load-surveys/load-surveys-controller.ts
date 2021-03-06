import { noContent, ok, serverError } from '@/presentation/helpers/http/http-helpers'
import { HttpRequest, HttpResponse, Controller, LoadSurveys } from './load-survey-controller-protocols'

export class LoadSurveysController implements Controller {
  constructor (
    private readonly loadSurveys: LoadSurveys
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const surveys = await this.loadSurveys.load()

      if (!surveys.length) return noContent()

      return ok(surveys)
    } catch (error) {
      return serverError(error)
    }
  }
}
