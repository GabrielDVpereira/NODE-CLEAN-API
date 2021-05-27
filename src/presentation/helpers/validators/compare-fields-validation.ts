import { InvalidParamError } from '../../errors'
import { Validation } from './validation'

export class CompareFieldsValidation implements Validation {
  private readonly fieldName: string
  private readonly fieldToComparteName: string
  constructor (fieldName: string, fieldToComparteName: string) {
    this.fieldName = fieldName
    this.fieldToComparteName = fieldToComparteName
  }

  validate (input: any): Error {
    if (input[this.fieldName] !== input[this.fieldToComparteName]) {
      return new InvalidParamError(this.fieldToComparteName)
    }
  }
}
