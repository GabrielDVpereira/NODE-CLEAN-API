export class AccessDeniedError extends Error {
  constructor () {
    super('Access denied') // this is the error object constructor, we pass the message we want to display
    this.name = 'AccessDeniedError' // this.name asign the error name to the name of the class
  }
}
