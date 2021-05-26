export class ServerError extends Error {
  constructor (stack: string) {
    super('Internal server error') // this is the error object constructor, we pass the message we want to display
    this.name = 'ServerError' // this.name asign the error name to the name of the class
    this.stack = stack
  }
}
