import { Validation } from '../../protocols/validation'

// a composite recieves an array of dependecies that implements the same interface and itearate through this array to execute each one
export class ValidationComposite implements Validation {
  private readonly validations: Validation[]
  constructor (validations: Validation[]) {
    this.validations = validations
  }

  validate (input: any): Error {
    for (const validation of this.validations) {
      const error = validation.validate(input)
      // if any o the validations fails, we reutrn imediatially
      if (error) {
        return error
      }
    }
  }
}
