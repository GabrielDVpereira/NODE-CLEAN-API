export class MissingParamError extends Error {
  constructor (paramName: string) {
    super(`Missing param: ${paramName}`) // this is the error object constructor, we pass the message we want to display
    this.name = 'MissingParamError' // this.name asign the error name to the name of the class
  }
}
