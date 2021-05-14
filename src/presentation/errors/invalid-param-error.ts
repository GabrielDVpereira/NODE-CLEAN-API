export class InvalidParamError extends Error {
  constructor (paramName: string) {
    super(`Invalid param: ${paramName}`) // this is the error object constructor, we pass the message we want to display
    this.name = 'InvalidParamError' // this.name asign the error name to the name of the class
  }
}
