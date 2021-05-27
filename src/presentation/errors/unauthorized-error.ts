export class UnauthorizedError extends Error {
  constructor () {
    super('Unauthorized') // this is the error object constructor, we pass the message we want to display
    this.name = 'UnauthorizedError' // this.name asign the error name to the name of the class
  }
}
